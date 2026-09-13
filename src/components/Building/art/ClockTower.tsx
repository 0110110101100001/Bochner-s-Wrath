import { useMemo } from 'react'
import type { ArtProps } from './types'

/**
 * The hands are driven purely by CSS animations with a negative delay taken
 * from the wall clock at mount, so the tower stays in sync without React ever
 * re-rendering it.
 */
export function ClockTower({ level, active }: ArtProps) {
  const offsets = useMemo(() => {
    const now = new Date()
    const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    return {
      hour: -(seconds % 43_200),
      minute: -(seconds % 3_600),
      second: -(seconds % 60),
    }
  }, [])

  const framed = level >= 2
  const showSeconds = level >= 3
  const legendary = level >= 4

  return (
    <svg viewBox="0 0 180 330" className={`art art--clock ${active ? 'is-active' : ''}`}>
      <defs>
        <linearGradient id="ct-stone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e9dcc0" />
          <stop offset="58%" stopColor="#cfbf9c" />
          <stop offset="100%" stopColor="#9c8c6c" />
        </linearGradient>
        <linearGradient id="ct-roof" x1="20%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor={legendary ? '#ffe27a' : '#59c6c0'} />
          <stop offset="55%" stopColor={legendary ? '#f0b41c' : '#2e9a97'} />
          <stop offset="100%" stopColor={legendary ? '#a9700a' : '#1c6a6c'} />
        </linearGradient>
        <radialGradient id="ct-face" cx="40%" cy="32%" r="76%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="72%" stopColor="#f3e6c8" />
          <stop offset="100%" stopColor="#d9c49a" />
        </radialGradient>
        <linearGradient id="ct-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff0a8" />
          <stop offset="50%" stopColor="#ffc32b" />
          <stop offset="100%" stopColor="#bf7d08" />
        </linearGradient>
      </defs>

      <ellipse className="art__shadow" cx="90" cy="306" rx="74" ry="18" />

      {/* plinth */}
      <path d="M26,304 L36,286 L144,286 L154,304 Z" fill="#b3a381" />
      <path d="M36,286 L144,286 L138,276 L42,276 Z" fill="#cdbd98" />

      {/* tower body */}
      <path d="M42,278 L48,116 L132,116 L138,278 Z" fill="url(#ct-stone)" />
      <path d="M114,116 L132,116 L138,278 L118,278 Z" fill="#8d7c5c" opacity="0.45" />
      <g stroke="#a2926f" strokeWidth="2" opacity="0.5">
        <path d="M44,250 H136 M46,214 H134 M47,178 H133 M48,142 H132" />
        <path d="M70,250 V278 M110,214 V250 M70,178 V214 M108,142 V178" />
      </g>

      {/* arched window with a pendulum behind it */}
      <path d="M70,272 L70,220 A20,20 0 0,1 110,220 L110,272 Z" fill="#2a1f12" />
      <g className="art__pendulum">
        <path d="M90,214 L90,256" stroke="#c9a24a" strokeWidth="3" />
        <circle cx="90" cy="260" r="9" fill="url(#ct-gold)" stroke="#8a5a08" strokeWidth="1.6" />
      </g>
      <path
        d="M70,272 L70,220 A20,20 0 0,1 110,220 L110,272"
        fill="none"
        stroke="#8d7a52"
        strokeWidth="5"
      />
      <path className="win-glow" d="M74,268 L74,222 A16,16 0 0,1 106,222 L106,268 Z" fill="#ffcf7a" opacity="0" />

      {/* cornice */}
      <path d="M34,120 L146,120 L142,106 L38,106 Z" fill="#b9a880" />
      <path d="M34,120 L146,120 L146,126 L34,126 Z" fill="#8d7c5c" />

      {/* roof */}
      <path d="M90,22 C120,54 138,82 146,106 L34,106 C42,82 60,54 90,22 Z" fill="url(#ct-roof)" />
      <path d="M90,22 C102,42 112,70 118,106 L146,106 C138,82 120,54 90,22 Z" fill="#000" opacity="0.16" />
      <g stroke={legendary ? '#a9700a' : '#1c6a6c'} strokeWidth="2.4" opacity="0.5" fill="none">
        <path d="M52,96 Q90,86 128,96" />
        <path d="M62,78 Q90,70 118,78" />
        <path d="M72,60 Q90,54 108,60" />
      </g>

      {/* finial and weather vane */}
      <path d="M90,22 L90,4" stroke="#6d5a34" strokeWidth="4" strokeLinecap="round" />
      <g className="art__vane">
        <path d="M78,8 L102,8 L96,14 L102,20 L78,20 Z" fill="url(#ct-gold)" />
      </g>

      {/* clock face */}
      <g>
        {framed && (
          <circle
            cx="90"
            cy="168"
            r="40"
            fill="none"
            stroke="url(#ct-gold)"
            strokeWidth="6"
            className={legendary ? 'art__frame is-legendary' : 'art__frame'}
          />
        )}
        <circle cx="90" cy="168" r="34" fill="url(#ct-face)" stroke="#8d7a52" strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6
          const r1 = i % 3 === 0 ? 24 : 27
          return (
            <line
              key={i}
              x1={90 + Math.sin(a) * r1}
              y1={168 - Math.cos(a) * r1}
              x2={90 + Math.sin(a) * 30}
              y2={168 - Math.cos(a) * 30}
              stroke="#6a5836"
              strokeWidth={i % 3 === 0 ? 3.2 : 1.8}
              strokeLinecap="round"
            />
          )
        })}

        <g className="clock-hand clock-hand--hour" style={{ animationDelay: `${offsets.hour}s` }}>
          <path d="M90,168 L90,150" stroke="#3d3120" strokeWidth="5.5" strokeLinecap="round" />
        </g>
        <g className="clock-hand clock-hand--minute" style={{ animationDelay: `${offsets.minute}s` }}>
          <path d="M90,168 L90,142" stroke="#3d3120" strokeWidth="3.8" strokeLinecap="round" />
        </g>
        {showSeconds && (
          <g className="clock-hand clock-hand--second" style={{ animationDelay: `${offsets.second}s` }}>
            <path d="M90,174 L90,140" stroke="#c4442f" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}
        <circle cx="90" cy="168" r="3.4" fill="#3d3120" />
      </g>

      {legendary && <circle className="art__legendary" cx="90" cy="168" r="52" fill="none" stroke="#ffe98a" strokeWidth="3" />}
    </svg>
  )
}
