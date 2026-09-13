import { useEffect, useRef, useState } from 'react'
import {
  PERSONAL_BREAK,
  PERSONAL_BREAK_THRESHOLD,
  RANDOM_EVENTS,
  type VillageEventDef,
} from '@/data/events'
import { chance } from '@/utils/random'
import { useBuilder } from './useBuilder'
import { useSfx } from './useSfx'
import { useStage } from './useStage'
import { useVillageStore } from './useVillageStore'

export interface OverlayEvent {
  id: string
  title: string
  body?: string
  duration: number
}

function weightedPick(events: VillageEventDef[]): VillageEventDef {
  const total = events.reduce((sum, e) => sum + e.weight, 0)
  let roll = Math.random() * total
  for (const event of events) {
    roll -= event.weight
    if (roll <= 0) return event
  }
  return events[0]!
}

/**
 * Everything that happens *because* a new tab was opened: a small resource
 * trickle and, sometimes, a village event.
 */
export function useArrivalEvents(enabled: boolean): OverlayEvent | null {
  const { state } = useVillageStore()
  const { pushToast, shake } = useStage()
  const builder = useBuilder()
  const sfx = useSfx()
  const [overlay, setOverlay] = useState<OverlayEvent | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!enabled || fired.current) return
    fired.current = true
    if (!state.settings.randomEvents) return

    const timers: number[] = []
    const compulsive = state.recentOpens.length >= PERSONAL_BREAK_THRESHOLD

    timers.push(
      window.setTimeout(() => {
        if (compulsive) {
          setOverlay({ ...PERSONAL_BREAK })
          sfx('pop')
          timers.push(window.setTimeout(() => setOverlay(null), PERSONAL_BREAK.duration))
          return
        }

        if (!chance(0.55)) return
        const event = weightedPick(RANDOM_EVENTS)

        if (event.kind === 'overlay') {
          setOverlay({
            id: event.id,
            title: event.title,
            body: event.body,
            duration: event.duration,
          })
          sfx('pop')
          timers.push(window.setTimeout(() => setOverlay(null), event.duration))
          return
        }

        if (event.kind === 'attack') {
          shake('big')
          sfx('boom')
          pushToast({ title: event.title, body: event.body, tone: 'danger', ttl: event.duration })
          builder.say('We are fine. Nothing happened.', { mood: 'staring', ms: 3400, lockMs: 1800 })
          return
        }

        if (event.kind === 'sale') {
          sfx('coin')
          pushToast({
            title: event.title,
            body: '8 000 000  ->  7 999 999',
            tone: 'gold',
            ttl: event.duration,
          })
          return
        }

        sfx('pop')
        pushToast({
          title: event.title,
          body: event.body,
          tone: event.tone ?? 'info',
          ttl: event.duration,
        })
      }, 1500),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [enabled, state.settings.randomEvents, state.recentOpens.length, pushToast, shake, sfx, builder])

  return overlay
}
