import type { ArtProps } from './types'

/** Laboratory of Questionable Productivity. Researching: why this tab was opened. */
export function Laboratory({ level, active }: ArtProps) {
  const charted = level >= 3

  return (
    <svg viewBox="0 0 250 270" className={`art art--lab ${active ? 'is-active' : ''}`}>
      <defs>
        <linearGradient id="lab-wall" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dfe4ee" />
          <stop offset="55%" stopColor="#b9c1d1" />
          <stop offset="100%" stopColor="#848da0" />
        </linearGradient>
        <linearGradient id="lab-roof" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#8f6fd8" />
          <stop offset="52%" stopColor="#5f3fae" />
          <stop offset="100%" stopColor="#3a2472" />
        </linearGradient>
        <radialGradient id="lab-window" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#a9f0d8" />
          <stop offset="72%" stopColor="#3fc79a" />
          <stop offset="100%" stopColor="#1d7f63" />
        </radialGradient>
      </defs>

      <ellipse className="art__shadow" cx="124" cy="238" rx="98" ry="20" />

      {/* base */}
      <path d="M34,236 L46,214 L202,214 L214,236 Z" fill="#a8977a" />

      {/* main block */}
      <path d="M52,216 L52,120 L196,120 L196,216 Z" fill="url(#lab-wall)" />
      <path d="M174,120 L196,120 L196,216 L174,216 Z" fill="#000" opacity="0.16" />
      <g stroke="#98a1b4" strokeWidth="2" opacity="0.55">
        <path d="M52,148 H196 M52,180 H196" />
        <path d="M92,120 V148 M148,148 V180 M112,180 V216" />
      </g>

      {/* slanted roof */}
      <path d="M40,124 L124,64 L208,124 Z" fill="url(#lab-roof)" />
      <path d="M124,64 L208,124 L186,124 L124,80 Z" fill="#000" opacity="0.18" />
      <path d="M36,124 L212,124 L212,136 L36,136 Z" fill="#4a2f8c" />
      <path d="M36,124 L212,124 L212,129 L36,129 Z" fill="#a98ce6" opacity="0.6" />

      {/* lightning rod */}
      <path d="M124,64 L124,28" stroke="#8b94a8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="124" cy="26" r="5" fill="#cfd7e6" />
      <g className="art__spark">
        <path d="M124,18 L114,34 L122,34 L112,50" stroke="#9df0ff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M124,18 L136,32 L128,33 L140,48" stroke="#9df0ff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>

      {/* round observation window with something bubbling behind it */}
      <circle cx="124" cy="166" r="34" fill="#2b3348" />
      <circle cx="124" cy="166" r="29" fill="url(#lab-window)" />
      <g className="art__lab-bubbles">
        <circle className="bubble" cx="112" cy="188" r="4" fill="#d6fff0" opacity="0.8" style={{ animationDuration: '3.6s' }} />
        <circle className="bubble" cx="130" cy="188" r="5.6" fill="#d6fff0" opacity="0.7" style={{ animationDelay: '1.3s', animationDuration: '4.4s' }} />
        <circle className="bubble" cx="122" cy="188" r="3" fill="#d6fff0" opacity="0.9" style={{ animationDelay: '2.4s', animationDuration: '3.1s' }} />
      </g>
      <circle cx="124" cy="166" r="29" fill="none" stroke="#6d768c" strokeWidth="6" />
      <path d="M110,150 A20,20 0 0,0 104,166" stroke="#fff" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round" />
      {[0, 90, 180, 270].map((a) => (
        <circle
          key={a}
          cx={124 + Math.cos((a * Math.PI) / 180) * 34}
          cy={166 + Math.sin((a * Math.PI) / 180) * 34}
          r="3.4"
          fill="#e3e9f4"
        />
      ))}

      {/* the flash of another breakthrough */}
      <circle className="art__flash" cx="124" cy="166" r="52" fill="#e9fbff" opacity="0" />

      {/* bench with flasks */}
      <g>
        <rect x="56" y="196" width="52" height="6" rx="3" fill="#7b6a4d" />
        <path d="M66,196 L66,182 L62,174 L80,174 L76,182 L76,196 Z" fill="#bfe9ff" opacity="0.85" />
        <path d="M66,192 L76,192 L76,196 L66,196 Z" fill="#ff7bb0" />
        <path d="M92,196 L92,178 L88,172 L104,172 L100,178 L100,196 Z" fill="#bfe9ff" opacity="0.85" />
        <path d="M92,190 L100,190 L100,196 L92,196 Z" fill="#7be0a0" />
      </g>

      {charted && (
        <g className="art__chart">
          <rect x="150" y="176" width="40" height="30" rx="3" fill="#f4f7fd" stroke="#6d768c" strokeWidth="2" />
          <path d="M154,200 L162,190 L170,196 L186,180" stroke="#d94f3d" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}
