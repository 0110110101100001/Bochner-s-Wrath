import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  format: (n: number) => string
  /** Tween length in ms. */
  duration?: number
}

const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * Counts smoothly to a new value. The rAF loop only exists while a value is
 * actually changing — the idle cost is zero.
 */
export function AnimatedNumber({ value, format, duration = 700 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const frame = useRef(0)
  const shown = useRef(value)

  useEffect(() => {
    const from = shown.current
    const delta = value - from
    if (delta === 0) return

    // Large jumps (a reset, a purchase) snap instead of grinding through.
    if (Math.abs(delta) > 250_000) {
      shown.current = value
      setDisplay(value)
      return
    }

    const startedAt = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration)
      const next = from + delta * easeOut(t)
      shown.current = next
      setDisplay(next)
      if (t < 1) frame.current = requestAnimationFrame(step)
    }

    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [value, duration])

  return <>{format(Math.round(display))}</>
}
