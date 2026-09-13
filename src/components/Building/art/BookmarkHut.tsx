import type { ArtProps } from './types'

const BOOKS = [
  { x: 72, w: 11, h: 34, fill: '#d94f3d' },
  { x: 85, w: 9, h: 30, fill: '#3f7fd6' },
  { x: 96, w: 13, h: 36, fill: '#4aa233' },
  { x: 111, w: 8, h: 28, fill: '#e0a417' },
  { x: 121, w: 12, h: 33, fill: '#8b5cf6' },
  { x: 135, w: 10, h: 30, fill: '#e06c9f' },
]

/** Holds 2 417 bookmarks. You have opened four of them. */
export function BookmarkHut({ level, active }: ArtProps) {
  const secondShelf = level >= 3

  return (
    <svg viewBox="0 0 240 250" className={`art art--bookmark ${active ? 'is-active' : ''}`}>
      <defs>
        <linearGradient id="bh-wall" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f0e0bd" />
          <stop offset="58%" stopColor="#d6c39c" />
          <stop offset="100%" stopColor="#a08e6b" />
        </linearGradient>
        <linearGradient id="bh-thatch" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#e5b85f" />
          <stop offset="48%" stopColor="#c48f34" />
          <stop offset="100%" stopColor="#8c6118" />
        </linearGradient>
        <linearGradient id="bh-wood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a9713c" />
          <stop offset="100%" stopColor="#6b4423" />
        </linearGradient>
      </defs>

      <ellipse className="art__shadow" cx="120" cy="222" rx="94" ry="19" />

      {/* base */}
      <path d="M32,220 L44,200 L196,200 L208,220 Z" fill="#a8977a" />

      {/* walls */}
      <path d="M48,202 L48,116 L192,116 L192,202 Z" fill="url(#bh-wall)" />
      <path d="M168,116 L192,116 L192,202 L168,202 Z" fill="#8e7d5d" opacity="0.4" />
      {/* timber framing */}
      <g stroke="url(#bh-wood)" strokeWidth="7" strokeLinecap="square">
        <path d="M48,202 V116 M192,202 V116 M48,156 H192" />
        <path d="M70,156 L100,116 M162,156 L132,116" />
      </g>

      {/* thatched roof */}
      <path d="M120,44 L212,120 L28,120 Z" fill="url(#bh-thatch)" />
      <path d="M120,44 L212,120 L188,120 L120,62 Z" fill="#000" opacity="0.14" />
      <g stroke="#8c6118" strokeWidth="2.4" opacity="0.45" fill="none">
        <path d="M50,110 Q120,96 190,110" />
        <path d="M62,96 Q120,84 178,96" />
        <path d="M76,80 Q120,70 164,80" />
      </g>
      <path d="M24,120 L216,120 L216,132 L24,132 Z" fill="#7d5324" />
      <path d="M24,120 L216,120 L216,125 L24,125 Z" fill="#c99447" opacity="0.7" />

      {/* shelf of books behind the open front */}
      <rect x="60" y="160" width="120" height="42" rx="4" fill="#2b1d0e" />
      <rect className="win-glow win-glow--soft" x="62" y="162" width="116" height="38" rx="3" fill="#ffb44a" opacity="0" />
      {BOOKS.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={200 - b.h} width={b.w} height={b.h} rx="2" fill={b.fill} />
          <rect x={b.x} y={200 - b.h} width={b.w} height="4" fill="#fff" opacity="0.35" />
          <rect x={b.x + 2} y={200 - b.h + 8} width={b.w - 4} height="2" fill="#fff" opacity="0.45" />
        </g>
      ))}
      <rect x="58" y="198" width="124" height="6" rx="3" fill="url(#bh-wood)" />

      {secondShelf && (
        <>
          <rect x="64" y="126" width="112" height="30" rx="3" fill="#2b1d0e" opacity="0.85" />
          {BOOKS.slice(0, 4).map((b, i) => (
            <rect key={i} x={b.x + 4} y={154 - b.h * 0.62} width={b.w * 0.85} height={b.h * 0.62} rx="2" fill={b.fill} opacity="0.9" />
          ))}
          <rect x="62" y="152" width="116" height="5" rx="2.5" fill="url(#bh-wood)" />
        </>
      )}

      {/* hanging sign with a ribbon bookmark */}
      <g className="art__sign">
        <path d="M196,128 L228,128" stroke="#5c3a1e" strokeWidth="4" strokeLinecap="round" />
        <path d="M212,128 L212,142" stroke="#5c3a1e" strokeWidth="3" />
        <rect x="190" y="142" width="44" height="34" rx="6" fill="url(#bh-wood)" stroke="#4a2d13" strokeWidth="3" />
        <path d="M204,146 L220,146 L220,170 L212,163 L204,170 Z" fill="#d94f3d" />
      </g>

    </svg>
  )
}
