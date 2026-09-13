import type { ArtProps } from './types'

const COINS = [
  { x: 82, y: 96, r: 14, rot: -12 },
  { x: 110, y: 86, r: 16, rot: 9 },
  { x: 140, y: 94, r: 14, rot: 22 },
  { x: 96, y: 76, r: 11, rot: 30 },
  { x: 126, y: 72, r: 12, rot: -20 },
  { x: 158, y: 104, r: 11, rot: 4 },
  { x: 64, y: 106, r: 11, rot: 16 },
]

/** A vault that has been "almost full" since you started playing. */
export function GoldStorage({ level, active }: ArtProps) {
  // A bigger storage visibly holds more. This is the upgrade doing something.
  const coins = COINS.slice(0, 3 + Math.min(level, 3) * 2)
  return (
    <svg viewBox="0 0 220 250" className={`art art--gold ${active ? 'is-active' : ''}`}>
      <defs>
        <linearGradient id="gs-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#efe3c8" />
          <stop offset="34%" stopColor="#d7c5a0" />
          <stop offset="76%" stopColor="#ab9974" />
          <stop offset="100%" stopColor="#7d6e52" />
        </linearGradient>
        <linearGradient id="gs-band" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c3cbdb" />
          <stop offset="42%" stopColor="#828da2" />
          <stop offset="100%" stopColor="#4a5468" />
        </linearGradient>
        <radialGradient id="gs-coin" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#fff5bd" />
          <stop offset="52%" stopColor="#ffc62e" />
          <stop offset="100%" stopColor="#c07f09" />
        </radialGradient>
      </defs>

      <ellipse className="art__shadow" cx="110" cy="226" rx="88" ry="18" />

      {/* stone plinth */}
      <path d="M24,224 L36,204 L184,204 L196,224 Z" fill="#9d8c70" />
      <path d="M36,204 L184,204 L176,192 L44,192 Z" fill="#bfae8c" />

      {/* silo body */}
      <path d="M44,194 L44,120 A66,26 0 0,1 176,120 L176,194 Z" fill="url(#gs-body)" />
      <path d="M150,124 L176,120 L176,194 L150,194 Z" fill="#6f6146" opacity="0.35" />
      <g stroke="#9d8c6c" strokeWidth="2.4" opacity="0.45">
        <path d="M44,168 H176 M44,142 H176" />
        <path d="M80,168 V194 M128,168 V194 M104,142 V168 M56,142 V168" />
      </g>

      {/* iron bands with rivets */}
      <rect x="38" y="158" width="144" height="15" rx="6" fill="url(#gs-band)" />
      <rect x="40" y="126" width="140" height="12" rx="5" fill="url(#gs-band)" opacity="0.95" />
      {[52, 86, 120, 154, 172].map((x) => (
        <circle key={x} cx={x} cy={165} r="3" fill="#e6ecf7" opacity="0.8" />
      ))}

      {/* front emblem */}
      <circle cx="110" cy="192" r="0" fill="none" />
      <g>
        <circle cx="110" cy="186" r="17" fill="#8c7c5c" />
        <circle cx="110" cy="184" r="14" fill="url(#gs-coin)" />
        <path
          d="M110,175 l2.4,5.2 5.6,0.8 -4.1,3.9 1,5.5 -4.9,-2.7 -4.9,2.7 1,-5.5 -4.1,-3.9 5.6,-0.8 Z"
          fill="#b87e10"
          opacity="0.6"
        />
      </g>

      {/* open rim and the hoard spilling out of it */}
      <ellipse cx="110" cy="120" rx="66" ry="25" fill="#9a8a67" />
      <ellipse cx="110" cy="118" rx="58" ry="19" fill="#5f5138" />
      <path
        d={`M56,116 Q110,${86 - level * 6} 164,116 Q110,138 56,116 Z`}
        fill="#e0a417"
      />
      {coins.map((c, i) => (
        <g key={i} transform={`rotate(${c.rot} ${c.x} ${c.y})`}>
          <ellipse cx={c.x} cy={c.y} rx={c.r} ry={c.r * 0.76} fill="url(#gs-coin)" />
          <ellipse cx={c.x} cy={c.y} rx={c.r * 0.5} ry={c.r * 0.36} fill="#fff3b8" opacity="0.5" />
        </g>
      ))}
      {/* a couple that never made it into the vault */}
      <ellipse cx="40" cy="200" rx="11" ry="8" fill="url(#gs-coin)" />
      <ellipse cx="186" cy="204" rx="10" ry="7" fill="url(#gs-coin)" />

      <g className="art__sparkles">
        <path className="sparkle sparkle--0" d="M100,56 l3.4,7.6 7.6,3.4 -7.6,3.4 -3.4,7.6 -3.4,-7.6 -7.6,-3.4 7.6,-3.4 Z" fill="#fff6c9" />
        <path className="sparkle sparkle--1" d="M154,72 l2.6,5.8 5.8,2.6 -5.8,2.6 -2.6,5.8 -2.6,-5.8 -5.8,-2.6 5.8,-2.6 Z" fill="#fff6c9" />
        <path className="sparkle sparkle--2" d="M66,80 l2,4.6 4.6,2 -4.6,2 -2,4.6 -2,-4.6 -4.6,-2 4.6,-2 Z" fill="#fff6c9" />
      </g>
    </svg>
  )
}
