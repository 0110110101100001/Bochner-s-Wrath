import type { TimeOfDay } from '@/types'

/** Anchor points for the sky crossfade, in hours. */
const PHASES: { at: number; tod: TimeOfDay }[] = [
  { at: 0, tod: 'night' },
  { at: 5, tod: 'night' },
  { at: 7, tod: 'dawn' },
  { at: 9.5, tod: 'day' },
  { at: 16.5, tod: 'day' },
  { at: 18.5, tod: 'dusk' },
  { at: 20.5, tod: 'night' },
  { at: 24, tod: 'night' },
]

export function hourOfDay(date: Date): number {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600
}

export function getTimeOfDay(date: Date): TimeOfDay {
  const h = hourOfDay(date)
  if (h < 5 || h >= 20.5) return 'night'
  if (h < 9.5) return 'dawn'
  if (h < 18.5) return 'day'
  return 'dusk'
}

/**
 * Opacity weights for the four stacked sky layers, so the transition between
 * phases is a continuous crossfade rather than a hard switch at the hour mark.
 */
export function getSkyMix(date: Date): Record<TimeOfDay, number> {
  const h = hourOfDay(date)
  const mix: Record<TimeOfDay, number> = { dawn: 0, day: 0, dusk: 0, night: 0 }

  for (let i = 0; i < PHASES.length - 1; i++) {
    const a = PHASES[i]!
    const b = PHASES[i + 1]!
    if (h < a.at || h > b.at) continue
    const t = b.at === a.at ? 0 : (h - a.at) / (b.at - a.at)
    mix[a.tod] += 1 - t
    mix[b.tod] += t
    break
  }

  const total = Object.values(mix).reduce((s, v) => s + v, 0) || 1
  for (const key of Object.keys(mix) as TimeOfDay[]) mix[key] /= total
  return mix
}

/** How high the sun/moon sits, 0 at the horizon and 1 at its peak. */
export function celestialArc(date: Date): { x: number; y: number; isMoon: boolean } {
  const h = hourOfDay(date)
  const isMoon = h < 6 || h >= 19
  // Sun rides 6:00 -> 19:00, moon takes the other half of the clock.
  const t = isMoon ? (((h + 5) % 24) / 11) % 1 : (h - 6) / 13
  const clamped = Math.max(0, Math.min(1, t))
  return {
    x: 8 + clamped * 84,
    y: 82 - Math.sin(clamped * Math.PI) * 68,
    isMoon,
  }
}

export function formatClock(date: Date, use24h: boolean): { time: string; suffix: string; seconds: string } {
  const h24 = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  if (use24h) {
    return { time: `${String(h24).padStart(2, '0')}:${minutes}`, suffix: '', seconds }
  }
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return { time: `${h12}:${minutes}`, suffix: h24 < 12 ? 'AM' : 'PM', seconds }
}

export function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
