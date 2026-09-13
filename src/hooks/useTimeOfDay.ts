import { useMemo } from 'react'
import type { TimeOfDay } from '@/types'
import { celestialArc, getSkyMix, getTimeOfDay } from '@/utils/time'
import { useNow } from './useNow'

export interface SkyState {
  tod: TimeOfDay
  mix: Record<TimeOfDay, number>
  celestial: { x: number; y: number; isMoon: boolean }
  hour: number
}

/** Local-clock driven atmosphere. No permissions, no geolocation. */
export function useSky(): SkyState {
  const now = useNow(30_000)
  return useMemo(
    () => ({
      tod: getTimeOfDay(now),
      mix: getSkyMix(now),
      celestial: celestialArc(now),
      hour: now.getHours(),
    }),
    [now],
  )
}
