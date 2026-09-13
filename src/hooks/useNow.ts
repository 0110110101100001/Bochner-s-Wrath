import { useEffect, useState } from 'react'
import { usePageVisible } from './usePageVisible'

/**
 * A ticking `Date`. Intentionally interval-based rather than rAF — nothing in
 * this UI needs the current time at 60 FPS.
 */
export function useNow(intervalMs = 1000): Date {
  const visible = usePageVisible()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!visible) return
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, visible])

  return now
}

/**
 * Bumps a counter on an interval, or not at all when `intervalMs` is null.
 * Used to drive progress bars without keeping a timer alive the rest of the time.
 */
export function useTick(intervalMs: number | null): number {
  const visible = usePageVisible()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (intervalMs === null || !visible) return
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, visible])

  return tick
}
