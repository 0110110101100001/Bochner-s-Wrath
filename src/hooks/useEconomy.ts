import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Drop, ResourceKind } from '@/types'
import { BUILDING_BY_ID } from '@/data/buildings'
import {
  ARRIVAL_DROPS,
  DROP_SPOTS,
  DROPS,
  fillRatio,
  pendingAmount,
  PRODUCTION,
} from '@/data/economy'
import { chance, randInt } from '@/utils/random'
import { useTick } from './useNow'
import { usePageVisible } from './usePageVisible'
import { useSfx } from './useSfx'
import { useStage } from './useStage'
import { useVillageStore } from './useVillageStore'

type Collectable = Exclude<ResourceKind, 'gems'>

export interface StorageCollector {
  kind: Collectable
  amount: number
  /** 0..1 of the cap, for the little meter on the bubble. */
  ratio: number
  x: number
  y: number
}

export interface CollectorsApi {
  collectors: StorageCollector[]
  collect: (kind: Collectable) => void
}

/**
 * Offline production. The storages fill while the tab is closed and hand the
 * loot over when the bubble above them is clicked.
 */
export function useCollectors(): CollectorsApi {
  const { state, actions } = useVillageStore()
  const { spawnFloat } = useStage()
  const sfx = useSfx()

  // The numbers creep up slowly; once every 20s is plenty. The tick has to be
  // a dependency of the memo below, which reads Date.now(): nothing else in its
  // dependencies changes as time passes, so without it the bubble would freeze
  // at whatever the storages held when the tab opened.
  const tick = useTick(20_000)

  const collectors = useMemo(() => {
    const now = Date.now()
    const build = (kind: Collectable, buildingId: 'gold-storage' | 'elixir-storage') => {
      const level = state.levels[buildingId] ?? 1
      const since = kind === 'gold' ? state.collectors.goldAt : state.collectors.elixirAt
      const building = BUILDING_BY_ID[buildingId]
      return {
        kind,
        amount: pendingAmount(kind, level, since, now),
        ratio: fillRatio(since, now),
        x: building.x,
        // Clear of the roof: the storages are about 23% of the stage tall.
        y: building.y - 25,
      }
    }
    return [build('gold', 'gold-storage'), build('elixir', 'elixir-storage')].filter(
      (c) => c.amount >= PRODUCTION.minToShow,
    )
    // `tick` is not read in the body, but it is what makes Date.now() move:
    // it is the whole reason this recomputes while the tab sits open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.levels, state.collectors, tick])

  const collect = useCallback(
    (kind: Collectable) => {
      const entry = collectors.find((c) => c.kind === kind)
      if (!entry) return
      actions.collectStorage(kind, entry.amount, Date.now())
      spawnFloat({ amount: entry.amount, kind, x: entry.x, y: entry.y })
      sfx('coin')
    },
    [collectors, actions, spawnFloat, sfx],
  )

  return { collectors, collect }
}

export interface DropsApi {
  drops: Drop[]
  grab: (id: number) => void
}

let dropId = 1

/**
 * Loose loot on the island: a haul scattered on arrival, then a steady trickle
 * of coins, droplets and the occasional gem while the tab stays open.
 */
export function useDrops(enabled: boolean): DropsApi {
  const { actions } = useVillageStore()
  const { spawnFloat } = useStage()
  const sfx = useSfx()
  const visible = usePageVisible()
  const [drops, setDrops] = useState<Drop[]>([])
  const timers = useRef<number[]>([])
  const arrived = useRef(false)

  // Expiry timers outlive the spawn loop, so loot survives a raid interrupting it.
  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const expire = useCallback((id: number, lifetimeMs: number) => {
    timers.current.push(
      window.setTimeout(() => setDrops((list) => list.filter((d) => d.id !== id)), lifetimeMs),
    )
  }, [])

  const addDrop = useCallback(
    (kind: ResourceKind, amount: number, lifetimeMs: number) => {
      setDrops((list) => {
        if (list.length >= DROPS.maxOnScreen + 3) return list
        const spotIndex = freeSpotIndex(list)
        if (spotIndex === null) return list
        const spot = DROP_SPOTS[spotIndex]!
        const drop: Drop = { id: dropId++, kind, amount, x: spot.x, y: spot.y, spot: spotIndex }
        expire(drop.id, lifetimeMs)
        return [...list, drop]
      })
    },
    [expire],
  )

  // The arrival haul: one big coin, a couple of droplets, sometimes a gem.
  useEffect(() => {
    if (!enabled || arrived.current) return
    arrived.current = true
    const { gold, elixir, gems, lifetimeMs } = ARRIVAL_DROPS
    let delay = 500

    const later = (fn: () => void) => {
      timers.current.push(window.setTimeout(fn, delay))
      delay += 260
    }

    for (let i = 0; i < gold.count; i++) {
      later(() => addDrop('gold', randInt(gold.min, gold.max), lifetimeMs))
    }
    for (let i = 0; i < elixir.count; i++) {
      later(() => addDrop('elixir', randInt(elixir.min, elixir.max), lifetimeMs))
    }
    if (chance(gems.chance)) {
      later(() => addDrop('gems', randInt(gems.min, gems.max), lifetimeMs))
    }
  }, [enabled, addDrop])

  // The ongoing trickle.
  useEffect(() => {
    if (!enabled || !visible) return
    let stopped = false
    let handle = 0

    const spawn = () => {
      if (stopped) return
      addDrop(
        Math.random() < 0.5 ? 'gold' : 'elixir',
        randInt(DROPS.min, DROPS.max),
        DROPS.lifetimeMs,
      )
      handle = window.setTimeout(spawn, randInt(DROPS.minGapMs, DROPS.maxGapMs))
    }

    handle = window.setTimeout(spawn, DROPS.firstDelayMs)
    return () => {
      stopped = true
      window.clearTimeout(handle)
    }
  }, [enabled, visible, addDrop])

  const grab = useCallback(
    (id: number) => {
      setDrops((list) => {
        const drop = list.find((d) => d.id === id)
        if (drop) {
          actions.addResources({ [drop.kind]: drop.amount })
          spawnFloat({ amount: drop.amount, kind: drop.kind, x: drop.x, y: drop.y })
          sfx(drop.kind === 'gems' ? 'sparkle' : 'coin')
        }
        return list.filter((d) => d.id !== id)
      })
    },
    [actions, spawnFloat, sfx],
  )

  return { drops, grab }
}

/** First unoccupied landing spot, or null when the island is covered. */
function freeSpotIndex(taken: Drop[]): number | null {
  const used = new Set(taken.map((d) => d.spot))
  const free: number[] = []
  DROP_SPOTS.forEach((_, i) => {
    if (!used.has(i)) free.push(i)
  })
  if (!free.length) return null
  return free[Math.floor(Math.random() * free.length)]!
}
