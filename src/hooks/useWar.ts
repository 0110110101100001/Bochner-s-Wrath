import { useEffect, useRef, useState } from 'react'
import type { Troop, WarState } from '@/types'
import { BUILDING_BY_ID, BUILDINGS } from '@/data/buildings'
import {
  ATTACKER_NAMES,
  ATTACKER_ORDER,
  ATTACKER_STAGES,
  ATTACKING_CLANS,
  DEFENCE_LINES,
  DEFENCE_ODDS,
  DEFENDER_ORDER,
  ESTIMATES,
  STAR_THRESHOLDS,
  WAR_END_LINES,
  WAR_MID_LINES,
  WAR_START_LINES,
  WAR_TIMING,
} from '@/data/war'
import { chance, pick, randFloat, randInt } from '@/utils/random'
import { useBuilder } from './useBuilder'
import { useSfx } from './useSfx'
import { useStage } from './useStage'

const IDLE_STATE: WarState = {
  phase: 'off',
  troops: [],
  wrecked: [],
  destruction: 0,
  stars: 0,
  startedAt: 0,
  battleMs: 1,
  attacker: '',
  clan: '',
  bolt: null,
  shields: {},
  held: [],
}

/** Island centre, matching the plateau in Island.tsx. */
const CENTRE = { x: 50, y: 55 }
/** Where the defenders come running from. */
const MUSTER = { x: 50, y: 68 }

/** A point just off the island, on the far side of `target` from the centre. */
function approachFrom(target: { x: number; y: number }) {
  const dx = target.x - CENTRE.x
  const dy = target.y - CENTRE.y
  const len = Math.hypot(dx, dy) || 1
  return {
    x: CENTRE.x + (dx / len) * 62,
    y: CENTRE.y + (dy / len) * 46,
  }
}

function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

function starsFor(destruction: number): number {
  return STAR_THRESHOLDS.filter((t) => destruction >= t - 0.5).length
}

/**
 * Scripted siege used as the screensaver: objects from partial differential
 * equations walk in from off the island, the villagers run out to meet them,
 * and every building puts up one a priori estimate before it stops existing.
 *
 * The whole replay is planned up front as a list of timeouts, so there is no
 * per-frame simulation: units move with CSS transitions and React only updates
 * at the handful of moments where something actually happens.
 */
export function useWar(active: boolean): WarState {
  const [war, setWar] = useState<WarState>(IDLE_STATE)
  const { shake } = useStage()
  const builder = useBuilder()
  const sfx = useSfx()

  // Kept in refs so restarting the loop never re-subscribes the effect.
  const builderRef = useRef(builder)
  const shakeRef = useRef(shake)
  const sfxRef = useRef(sfx)
  builderRef.current = builder
  shakeRef.current = shake
  sfxRef.current = sfx

  useEffect(() => {
    if (!active) {
      setWar(IDLE_STATE)
      return
    }

    let stopped = false
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!stopped) fn()
        }, ms),
      )
    }

    const moveUnit = (id: number, patch: Partial<Troop>) =>
      setWar((w) => ({
        ...w,
        troops: w.troops.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }))

    const runReplay = () => {
      // Everything scheduled by the previous loop has already fired.
      timers.length = 0
      let stars = 0
      let unitId = 0
      let lost = 0
      const targets = shuffled(BUILDINGS.map((b) => b.id))
      // Decided up front so the meter and the result card agree with the fight.
      const defended = targets.map(() => chance(DEFENCE_ODDS))
      const estimates = shuffled(ESTIMATES)
      const share = 100 / targets.length
      const { intro, wave, march, attack, settle, result, restart } = WAR_TIMING
      const battleMs = intro + (targets.length - 1) * wave + march + attack

      setWar({
        ...IDLE_STATE,
        phase: 'intro',
        startedAt: Date.now(),
        battleMs,
        attacker: pick(ATTACKER_NAMES),
        clan: pick(ATTACKING_CLANS),
      })

      at(intro - 400, () => {
        setWar((w) => ({ ...w, phase: 'battle' }))
        builderRef.current.say(pick(WAR_START_LINES), { mood: 'angry', ms: 3200, lockMs: 2000 })
      })

      targets.forEach((id, index) => {
        const building = BUILDING_BY_ID[id]
        const spawnAt = intro + index * wave
        const outside = approachFrom(building)
        // The attacker takes the outer side; the villager blocks from the village.
        const outward = building.x < CENTRE.x ? -1 : 1
        const attackerStand = { x: building.x + outward * 8, y: building.y + randFloat(-1, 1.5) }
        const defenderStand = { x: building.x - outward * 7, y: building.y + randFloat(0, 2) }

        const attackerId = unitId++
        const defenderId = unitId++
        const attackerKind = ATTACKER_ORDER[index % ATTACKER_ORDER.length]!
        const defenderKind = DEFENDER_ORDER[index % DEFENDER_ORDER.length]!

        at(spawnAt, () => {
          const incoming: Troop = {
            id: attackerId,
            side: 'attack',
            kind: attackerKind,
            x: outside.x,
            y: outside.y,
            travelMs: 0,
            facing: attackerStand.x > outside.x ? 1 : -1,
            state: 'marching',
            stage: 0,
          }
          const villager: Troop = {
            id: defenderId,
            side: 'defend',
            kind: defenderKind,
            x: MUSTER.x,
            y: MUSTER.y,
            travelMs: 0,
            facing: defenderStand.x > MUSTER.x ? 1 : -1,
            state: 'marching',
            stage: 0,
          }
          setWar((w) => ({ ...w, troops: [...w.troops, incoming, villager] }))
          sfxRef.current('pop')
        })

        // One frame later, so the CSS transitions have a start value.
        at(spawnAt + 60, () => {
          moveUnit(attackerId, { ...attackerStand, travelMs: march })
          moveUnit(defenderId, { ...defenderStand, travelMs: Math.round(march * 0.8) })
        })

        at(spawnAt + march, () => {
          moveUnit(attackerId, { state: 'attacking' })
          moveUnit(defenderId, { state: 'attacking' })
          const estimate = estimates[index % estimates.length]!
          setWar((w) => ({ ...w, shields: { ...w.shields, [id]: estimate } }))

          // Every hit costs the operator one embedding. A losing engagement
          // only knocks it down one rung; a won one walks it all the way to L¹.
          const chain = ATTACKER_STAGES[attackerKind]
          const steps = defended[index] ? chain.length - 1 : 1
          for (let step = 1; step <= steps; step++) {
            at(Math.round((attack * 0.78 * step) / steps), () => {
              moveUnit(attackerId, { stage: step })
              sfxRef.current('hammer')
            })
          }
        })

        at(spawnAt + march + attack, () => {
          if (defended[index]) {
            // The estimate held: the operator is knocked out, the building stays.
            sfxRef.current('sparkle')
            setWar((w) => ({
              ...w,
              held: [...w.held, id],
              troops: w.troops.map((t) =>
                t.id === attackerId
                  ? { ...t, state: 'beaten' }
                  : t.id === defenderId
                    ? { ...t, state: 'cheering' }
                    : t,
              ),
            }))
            if (chance(0.55)) {
              builderRef.current.say(pick(DEFENCE_LINES), { ms: 2600, lockMs: 900 })
            }
            // Drop the shield again once everyone has seen it hold.
            at(1800, () =>
              setWar((w) => {
                const shields = { ...w.shields }
                delete shields[id]
                return { ...w, shields, held: w.held.filter((h) => h !== id) }
              }),
            )
            return
          }

          shakeRef.current(index === targets.length - 1 ? 'big' : 'small')
          sfxRef.current('boom')
          lost += 1
          const destruction = Math.min(100, Math.round(lost * share))
          stars = starsFor(destruction)
          setWar((w) => {
            const shields = { ...w.shields }
            delete shields[id]
            return {
              ...w,
              wrecked: [...w.wrecked, id],
              destruction,
              stars,
              shields,
              troops: w.troops.map((t) =>
                t.id === attackerId
                  ? { ...t, state: 'cheering' }
                  : t.id === defenderId
                    ? { ...t, state: 'beaten' }
                    : t,
              ),
            }
          })
        })
      })

      // One blow-up somewhere in the middle, for flavour.
      const boltAt = intro + randInt(1, Math.max(1, targets.length - 2)) * wave + 700
      at(boltAt, () => {
        const id = pick(targets)
        shakeRef.current('small')
        setWar((w) => ({ ...w, bolt: id }))
        at(700, () => setWar((w) => ({ ...w, bolt: null })))
      })

      at(Math.round(battleMs * 0.55), () => {
        builderRef.current.say(pick(WAR_MID_LINES), { ms: 3400, lockMs: 1200 })
      })

      at(battleMs + settle, () => {
        const lines = WAR_END_LINES[stars] ?? WAR_END_LINES[3]!
        builderRef.current.say(pick(lines), { mood: 'disappointed', ms: 4200, lockMs: 2600 })
        setWar((w) => ({ ...w, phase: 'result' }))
      })

      at(battleMs + settle + result + restart, runReplay)
    }

    // The Builder stays put and off his idle script for the duration, so he
    // does not wander off mid-raid offering opinions about gems.
    builderRef.current.setAutonomous(false)
    runReplay()

    return () => {
      stopped = true
      timers.forEach(window.clearTimeout)
      builderRef.current.setAutonomous(true)
    }
  }, [active])

  return war
}
