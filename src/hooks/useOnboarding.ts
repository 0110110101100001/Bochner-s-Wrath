import { useEffect, useRef, useState } from 'react'
import { ONBOARDING_LINES } from '@/data/jokes'
import { useBuilder } from './useBuilder'
import { useVillageStore } from './useVillageStore'

/**
 * First-run sequence: the Builder wanders in, notices the browser, resigns
 * himself to it, and only then does the rest of the UI arrive.
 *
 * Returns whether the HUD should be visible yet.
 */
export function useOnboarding(ready: boolean): boolean {
  const { state, actions } = useVillageStore()
  const builder = useBuilder()
  const [hudVisible, setHudVisible] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (!ready || started.current) return
    started.current = true

    if (state.onboardingCompleted) {
      setHudVisible(true)
      return
    }

    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    builder.setAutonomous(false)
    builder.teleport({ x: -14, y: 80 })

    let clock = 260
    at(clock, () => builder.walkTo({ x: 46, y: 80 }))
    clock += 2600

    at(clock, () => {
      builder.setMood('staring')
      builder.say(ONBOARDING_LINES[0], { ms: 2000, lockMs: 2000 })
    })
    clock += 2500

    at(clock, () => builder.say(ONBOARDING_LINES[1], { mood: 'idle', ms: 3200, lockMs: 3200 }))
    clock += 3300

    at(clock, () => {
      builder.say(ONBOARDING_LINES[2], { mood: 'hammering', ms: 3000, lockMs: 3000 })
      setHudVisible(true)
    })
    clock += 1400

    at(clock, () => {
      builder.setAutonomous(true)
      actions.finishOnboarding()
    })

    return () => timers.forEach(window.clearTimeout)
    // Runs exactly once, guarded by `started`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return hudVisible
}
