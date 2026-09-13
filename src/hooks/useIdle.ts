import { useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart'] as const

/**
 * True once the user has left the tab alone for `delayMs`.
 *
 * Activity listeners are passive and only touch React state on the transition,
 * so moving the mouse does not re-render anything. Coming back to the tab
 * counts as activity; callers gate on visibility separately.
 */
export function useIdle(delayMs: number, enabled: boolean): boolean {
  const [idle, setIdle] = useState(false)
  const idleRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      idleRef.current = false
      setIdle(false)
      return
    }

    let handle = 0

    const goIdle = () => {
      idleRef.current = true
      setIdle(true)
    }

    const reset = () => {
      if (idleRef.current) {
        idleRef.current = false
        setIdle(false)
      }
      window.clearTimeout(handle)
      handle = window.setTimeout(goIdle, delayMs)
    }

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }))
    document.addEventListener('visibilitychange', reset)
    reset()

    return () => {
      window.clearTimeout(handle)
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset))
      document.removeEventListener('visibilitychange', reset)
    }
  }, [delayMs, enabled])

  return idle
}
