import { useMemo } from 'react'
import type { TimeOfDay } from '@/types'
import './Sky.scss'

interface SkyProps {
  mix: Record<TimeOfDay, number>
  celestial: { x: number; y: number; isMoon: boolean }
  animated: boolean
}

const STAR_COUNT = 64

/** Deterministic star field — the same sky every time the tab opens. */
function useStars() {
  return useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => {
        // Cheap hash so the layout is stable without shipping a PRNG.
        const a = Math.sin(i * 12.9898) * 43758.5453
        const b = Math.sin(i * 78.233) * 12345.6789
        const c = Math.sin(i * 3.1415) * 9876.5432
        return {
          x: (a - Math.floor(a)) * 100,
          y: (b - Math.floor(b)) * 62,
          r: 0.6 + (c - Math.floor(c)) * 1.5,
          delay: ((c - Math.floor(c)) * 6).toFixed(2),
        }
      }),
    [],
  )
}

export function Sky({ mix, celestial, animated }: SkyProps) {
  const stars = useStars()

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__layer sky__layer--night" style={{ opacity: mix.night }} />
      <div className="sky__layer sky__layer--dawn" style={{ opacity: mix.dawn }} />
      <div className="sky__layer sky__layer--day" style={{ opacity: mix.day }} />
      <div className="sky__layer sky__layer--dusk" style={{ opacity: mix.dusk }} />

      <svg className="sky__stars" viewBox="0 0 100 62" preserveAspectRatio="none">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r * 0.18}
            className="sky__star"
            style={animated ? { animationDelay: `${s.delay}s` } : undefined}
          />
        ))}
      </svg>

      <div
        className={`sky__celestial ${celestial.isMoon ? 'is-moon' : 'is-sun'}`}
        style={{ left: `${celestial.x}%`, top: `${celestial.y}%` }}
      >
        <div className="sky__glow" />
        {celestial.isMoon ? (
          <svg viewBox="0 0 100 100" className="sky__body">
            <defs>
              <radialGradient id="moon-face" cx="38%" cy="34%" r="76%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e8eefc" />
                <stop offset="100%" stopColor="#b9c6e6" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="34" fill="url(#moon-face)" />
            <circle cx="40" cy="42" r="7" fill="#cbd6ee" opacity="0.75" />
            <circle cx="60" cy="58" r="5" fill="#cbd6ee" opacity="0.6" />
            <circle cx="56" cy="36" r="3.2" fill="#cbd6ee" opacity="0.55" />
          </svg>
        ) : (
          <svg viewBox="0 0 100 100" className="sky__body">
            <defs>
              <radialGradient id="sun-face" cx="42%" cy="38%" r="70%">
                <stop offset="0%" stopColor="#fffbe6" />
                <stop offset="55%" stopColor="#ffdf6b" />
                <stop offset="100%" stopColor="#ffab2b" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="30" fill="url(#sun-face)" />
          </svg>
        )}
      </div>

      <svg className="sky__hills" viewBox="0 0 1440 260" preserveAspectRatio="none">
        <path
          d="M0,260 L0,156 C90,120 168,142 248,120 C330,97 392,52 470,64 C552,77 596,132 684,138 C772,144 840,96 926,92 C1014,88 1078,128 1160,124 C1244,120 1340,80 1440,96 L1440,260 Z"
          fill="var(--hill-far)"
        />
        <path
          d="M0,260 L0,204 C120,182 208,206 320,192 C436,178 508,138 616,150 C728,162 792,208 900,204 C1010,200 1090,166 1200,176 C1300,185 1380,200 1440,206 L1440,260 Z"
          fill="var(--hill-near)"
        />
      </svg>

      <div className="sky__clouds">
        {[0, 1, 2, 3, 4].map((i) => (
          <Cloud key={i} index={i} animated={animated} />
        ))}
      </div>

      <div className="sky__birds" style={{ opacity: mix.night > 0.55 ? 0 : 1 }}>
        {[0, 1, 2].map((i) => (
          <Bird key={i} index={i} animated={animated} />
        ))}
      </div>
    </div>
  )
}

const CLOUD_CONFIG = [
  { top: 12, scale: 1, duration: 168, delay: -20, opacity: 0.9 },
  { top: 22, scale: 0.62, duration: 220, delay: -120, opacity: 0.7 },
  { top: 7, scale: 0.78, duration: 260, delay: -60, opacity: 0.55 },
  { top: 31, scale: 0.48, duration: 300, delay: -210, opacity: 0.5 },
  { top: 17, scale: 1.24, duration: 200, delay: -150, opacity: 0.35 },
]

function Cloud({ index, animated }: { index: number; animated: boolean }) {
  const cfg = CLOUD_CONFIG[index] ?? CLOUD_CONFIG[0]!
  return (
    <div
      className="cloud"
      style={{
        top: `${cfg.top}%`,
        opacity: cfg.opacity,
        transform: `scale(${cfg.scale})`,
        animationDuration: `${cfg.duration}s`,
        animationDelay: `${cfg.delay}s`,
        animationPlayState: animated ? 'running' : 'paused',
      }}
    >
      <svg viewBox="0 0 260 110">
        <g fill="#ffffff">
          <ellipse cx="80" cy="72" rx="70" ry="32" />
          <ellipse cx="140" cy="58" rx="56" ry="40" />
          <ellipse cx="186" cy="76" rx="52" ry="28" />
          <ellipse cx="112" cy="48" rx="38" ry="30" />
        </g>
        <g fill="#dbe8f7" opacity="0.85">
          <ellipse cx="82" cy="88" rx="62" ry="16" />
          <ellipse cx="182" cy="90" rx="46" ry="13" />
        </g>
      </svg>
    </div>
  )
}

const BIRD_CONFIG = [
  { top: 26, duration: 42, delay: -6, scale: 1 },
  { top: 31, duration: 46, delay: -14, scale: 0.72 },
  { top: 22, duration: 52, delay: -28, scale: 0.58 },
]

function Bird({ index, animated }: { index: number; animated: boolean }) {
  const cfg = BIRD_CONFIG[index] ?? BIRD_CONFIG[0]!
  return (
    <div
      className="bird"
      style={{
        top: `${cfg.top}%`,
        transform: `scale(${cfg.scale})`,
        animationDuration: `${cfg.duration}s`,
        animationDelay: `${cfg.delay}s`,
        animationPlayState: animated ? 'running' : 'paused',
      }}
    >
      <svg viewBox="0 0 40 20" className="bird__wings">
        <path d="M2 12 Q10 2 19 11 Q28 2 38 12" fill="none" stroke="#33415c" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </div>
  )
}
