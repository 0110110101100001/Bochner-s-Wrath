import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { BuilderMood } from '@/types'
import { BUILDER_WAYPOINTS } from '@/data/buildings'
import {
  CLICK_LINES,
  CLICK_WALK_OFF_LINE,
  IDLE_LINES,
  LATE_NIGHT_LINE,
  MORNING_LINES,
  NIGHT_LINES,
  RETURN_LINE,
} from '@/data/jokes'
import { chance, pick, pickOther, randFloat, randInt } from '@/utils/random'
import { usePageVisible } from './usePageVisible'

export interface Point {
  x: number
  y: number
}

interface SayOptions {
  mood?: BuilderMood
  ms?: number
  /** Keeps the autonomous loop from overriding the mood for this long. */
  lockMs?: number
}

interface BuilderValue {
  mood: BuilderMood
  pos: Point
  facing: 1 | -1
  travelMs: number
  speech: string | null
  say: (text: string, options?: SayOptions) => void
  walkTo: (point: Point, speedScale?: number) => number
  /** Moves without walking, for entrances and exits. */
  teleport: (point: Point) => void
  setMood: (mood: BuilderMood, lockMs?: number) => void
  poke: () => void
  /** Where the Builder should stand while something is being built. */
  setWorkSite: (point: Point | null) => void
  /** Pauses autonomous behaviour, e.g. during the first-run sequence. */
  setAutonomous: (on: boolean) => void
}

const BuilderContext = createContext<BuilderValue | null>(null)

const START: Point = { x: 52, y: 82 }
const WALK_SPEED = 6.2 // stage-percent per second

const IDLE_MOODS: BuilderMood[] = ['idle', 'staring', 'drinking', 'dropped-hammer', 'hammering']

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<BuilderMood>('idle')
  const [pos, setPos] = useState<Point>(START)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [travelMs, setTravelMs] = useState(0)
  const [speech, setSpeech] = useState<string | null>(null)

  const visible = usePageVisible()
  const autonomous = useRef(true)
  const workSite = useRef<Point | null>(null)
  const lockUntil = useRef(0)
  const posRef = useRef(START)
  const moodRef = useRef<BuilderMood>('idle')
  const clicks = useRef(0)
  const clickResetAt = useRef(0)
  const lastLine = useRef<string | null>(null)
  const speechTimer = useRef(0)
  const timers = useRef<number[]>([])

  posRef.current = pos
  moodRef.current = mood

  const after = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout)
      window.clearTimeout(speechTimer.current)
    },
    [],
  )

  const say = useCallback((text: string, options: SayOptions = {}) => {
    const { mood: nextMood, ms = 3600, lockMs } = options
    setSpeech(text)
    window.clearTimeout(speechTimer.current)
    speechTimer.current = window.setTimeout(() => setSpeech(null), ms)
    if (nextMood) setMoodState(nextMood)
    lockUntil.current = Math.max(lockUntil.current, Date.now() + (lockMs ?? ms))
  }, [])

  const setMood = useCallback((next: BuilderMood, lockMs = 0) => {
    setMoodState(next)
    if (lockMs) lockUntil.current = Math.max(lockUntil.current, Date.now() + lockMs)
  }, [])

  const walkTo = useCallback((point: Point, speedScale = 1) => {
    const from = posRef.current
    const dx = point.x - from.x
    const dy = point.y - from.y
    const distance = Math.hypot(dx, dy * 0.6)
    const duration = Math.min(4200, Math.max(520, (distance / (WALK_SPEED * speedScale)) * 1000))

    if (Math.abs(dx) > 0.4) setFacing(dx > 0 ? 1 : -1)
    setTravelMs(duration)
    setPos(point)
    posRef.current = point
    setMoodState('walking')
    return duration
  }, [])

  const teleport = useCallback((point: Point) => {
    setTravelMs(0)
    setPos(point)
    posRef.current = point
  }, [])

  /* ---------------------------------------------------------- autonomy loop */

  useEffect(() => {
    if (!visible) return
    let stopped = false
    let handle = 0

    const schedule = (ms: number) => {
      handle = window.setTimeout(beat, ms)
    }

    const maybeTalk = (hour: number) => {
      if (!chance(0.3)) return
      if (hour === 3) {
        say(LATE_NIGHT_LINE, { ms: 5200, lockMs: 0 })
        return
      }
      const pool: readonly string[] =
        hour >= 22 || hour < 5 ? NIGHT_LINES : hour < 9 ? MORNING_LINES : IDLE_LINES
      const line = pickOther(pool, lastLine.current)
      lastLine.current = line
      say(line, { ms: 4200, lockMs: 0 })
    }

    function beat() {
      if (stopped) return
      const now = Date.now()

      if (clicks.current > 0 && now > clickResetAt.current) clicks.current = 0

      const busy = moodRef.current === 'leaving' || moodRef.current === 'away'
      if (busy || !autonomous.current || now < lockUntil.current) {
        schedule(randInt(700, 1400))
        return
      }

      const site = workSite.current
      const here = posRef.current
      const hour = new Date().getHours()

      if (site && Math.hypot(site.x - here.x, site.y - here.y) > 3) {
        const ms = walkTo(site)
        after(() => {
          if (!stopped) setMoodState('hammering')
        }, ms)
        schedule(ms + randInt(2600, 5200))
        return
      }

      if (site) {
        setMoodState(chance(0.82) ? 'hammering' : 'idle')
        maybeTalk(hour)
        schedule(randInt(3400, 6200))
        return
      }

      if (chance(0.42)) {
        const target = pick(BUILDER_WAYPOINTS)
        const ms = walkTo({
          x: target.x + randFloat(-2.5, 2.5),
          y: target.y + randFloat(-1.5, 1.5),
        })
        after(() => {
          if (!stopped) setMoodState(pick(IDLE_MOODS))
        }, ms)
        schedule(ms + randInt(2400, 5000))
        return
      }

      const nightTime = hour >= 22 || hour < 5
      setMoodState(nightTime && chance(0.45) ? 'sleeping' : pick(IDLE_MOODS))
      maybeTalk(hour)
      schedule(randInt(3200, 7000))
    }

    schedule(1400)
    return () => {
      stopped = true
      window.clearTimeout(handle)
    }
  }, [visible, walkTo, say, after])

  /* ----------------------------------------------------------------- poking */

  const poke = useCallback(() => {
    const now = Date.now()
    if (mood === 'away' || mood === 'leaving') return

    if (now > clickResetAt.current) clicks.current = 0
    clicks.current += 1
    clickResetAt.current = now + 6000

    if (clicks.current >= 8) {
      clicks.current = 0
      say(CLICK_WALK_OFF_LINE, { ms: 1600, lockMs: 12_000 })
      setMoodState('leaving')
      const exitLeft = posRef.current.x < 50
      const ms = walkTo({ x: exitLeft ? -18 : 118, y: posRef.current.y }, 1.7)

      after(() => {
        setMoodState('away')
        after(() => {
          // Reappears on the same side he stormed off to, grumbling.
          setTravelMs(0)
          const entry = { x: exitLeft ? -16 : 116, y: 80 }
          setPos(entry)
          posRef.current = entry
          after(() => {
            walkTo(pick(BUILDER_WAYPOINTS))
            say(RETURN_LINE, { ms: 3200, lockMs: 0 })
          }, 80)
        }, 5200)
      }, ms)
      return
    }

    const line = CLICK_LINES[Math.min(clicks.current, 7)] ?? 'Hmm?'
    const annoyed = clicks.current >= 5
    say(line, { mood: annoyed ? 'angry' : 'staring', ms: annoyed ? 2200 : 2600, lockMs: 1800 })
  }, [mood, say, walkTo, after])

  const setWorkSite = useCallback((point: Point | null) => {
    workSite.current = point
  }, [])

  const setAutonomous = useCallback((on: boolean) => {
    autonomous.current = on
  }, [])

  const value = useMemo<BuilderValue>(
    () => ({
      mood,
      pos,
      facing,
      travelMs,
      speech,
      say,
      walkTo,
      teleport,
      setMood,
      poke,
      setWorkSite,
      setAutonomous,
    }),
    [
      mood,
      pos,
      facing,
      travelMs,
      speech,
      say,
      walkTo,
      teleport,
      setMood,
      poke,
      setWorkSite,
      setAutonomous,
    ],
  )

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
}

export function useBuilder(): BuilderValue {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>')
  return ctx
}
