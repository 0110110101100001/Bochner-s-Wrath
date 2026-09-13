import type { ArtProps } from './types'

/** Occupied. Permanently. */
export function BuilderHut({ level, active }: ArtProps) {
  const cushioned = level >= 2

  return (
    <svg viewBox="0 0 230 260" className={`art art--hut ${active ? 'is-active' : ''}`}>
      <defs>
        <linearGradient id="hut-wall" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c58a4e" />
          <stop offset="55%" stopColor="#a06c35" />
          <stop offset="100%" stopColor="#6f4720" />
        </linearGradient>
        <linearGradient id="hut-roof2" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#6fb9d8" />
          <stop offset="50%" stopColor="#3a87ad" />
          <stop offset="100%" stopColor="#1f5a78" />
        </linearGradient>
      </defs>

      <ellipse className="art__shadow" cx="112" cy="228" rx="88" ry="18" />

      {/* base */}
      <path d="M30,226 L42,206 L182,206 L194,226 Z" fill="#a8977a" />

      {/* walls */}
      <path d="M46,208 L46,128 L178,128 L178,208 Z" fill="url(#hut-wall)" />
      <path d="M156,128 L178,128 L178,208 L156,208 Z" fill="#000" opacity="0.2" />
      <g stroke="#6f4720" strokeWidth="2.6" opacity="0.6">
        <path d="M46,150 H178 M46,172 H178 M46,194 H178" />
      </g>

      {/* roof */}
      <path d="M112,58 L206,134 L18,134 Z" fill="url(#hut-roof2)" />
      <path d="M112,58 L206,134 L182,134 L112,76 Z" fill="#000" opacity="0.16" />
      <g stroke="#1f5a78" strokeWidth="2.6" opacity="0.5" fill="none">
        <path d="M44,124 H180 M56,110 H168 M70,96 H154" />
      </g>
      <path d="M14,134 L210,134 L210,146 L14,146 Z" fill="#25698c" />
      <path d="M14,134 L210,134 L210,139 L14,139 Z" fill="#84ccdf" opacity="0.6" />

      {/* chimney with smoke */}
      <path d="M158,96 L158,62 L184,62 L184,110 Z" fill="#9b8b6c" />
      <path d="M154,62 L188,62 L188,52 L154,52 Z" fill="#b9a883" />
      <g className="art__smoke">
        <circle className="puff puff--0" cx="171" cy="46" r="9" fill="#e8eef6" />
        <circle className="puff puff--1" cx="171" cy="46" r="7" fill="#e8eef6" />
        <circle className="puff puff--2" cx="171" cy="46" r="11" fill="#e8eef6" />
      </g>

      {/* door */}
      <path d="M92,208 L92,158 A20,20 0 0,1 132,158 L132,208 Z" fill="#5b3a1c" />
      <path d="M92,208 L92,158 A20,20 0 0,1 132,158 L132,208" fill="none" stroke="#3d2612" strokeWidth="4" />
      <circle cx="124" cy="184" r="3.6" fill="#e9c46a" />
      <path className="win-glow" d="M96,204 L96,160 A16,16 0 0,1 128,160 L128,204 Z" fill="#ffcf7a" opacity="0" />

      {/* window */}
      <rect x="54" y="152" width="30" height="26" rx="4" fill="#2c1e10" />
      <rect className="win-glow" x="56" y="154" width="26" height="22" rx="3" fill="#ffcf7a" opacity="0" />
      <path d="M69,152 V178 M54,165 H84" stroke="#6f4720" strokeWidth="3" />

      {/* tools leaning against the wall */}
      <g>
        <path d="M188,206 L198,152" stroke="#8a5a33" strokeWidth="5" strokeLinecap="round" />
        <path d="M192,150 L210,144 L212,152 L194,158 Z" fill="#9aa3b4" stroke="#4f596c" strokeWidth="1.8" />
        <path d="M38,206 L31,164" stroke="#8a5a33" strokeWidth="4.4" strokeLinecap="round" />
        <path d="M31,164 q-9,-12 2,-18 q11,6 2,18 Z" fill="#c0c8d6" stroke="#6e7889" strokeWidth="1.8" />
      </g>

      {/* the chair, technically an upgrade */}
      {cushioned && (
        <g>
          <path d="M196,206 L196,182 L216,182 L216,206 Z" fill="#8a5a33" />
          <path d="M194,182 L218,182 L218,174 L194,174 Z" fill="#d94f3d" />
        </g>
      )}
    </svg>
  )
}
