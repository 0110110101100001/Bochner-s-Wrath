import type { ArtProps } from './types'

/**
 * The Great Search Hall. Stone facade, terracotta roof, a gilded lens over the
 * door and two braziers that never quite settle.
 */
export function SearchHall({ level, active }: ArtProps) {
  const gilded = level >= 3
  const legendary = level >= 4

  return (
    <svg viewBox="0 0 320 300" className={`art art--hall ${active ? 'is-active' : ''}`}>
      <defs>
        <linearGradient id="hall-stone" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0e3c8" />
          <stop offset="55%" stopColor="#d8c39f" />
          <stop offset="100%" stopColor="#b39d76" />
        </linearGradient>
        <linearGradient id="hall-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a38b64" />
          <stop offset="100%" stopColor="#7d684a" />
        </linearGradient>
        <linearGradient id="hall-roof" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#e8734f" />
          <stop offset="52%" stopColor="#c74f34" />
          <stop offset="100%" stopColor="#8e3120" />
        </linearGradient>
        <linearGradient id="hall-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff0a8" />
          <stop offset="45%" stopColor="#ffc32b" />
          <stop offset="100%" stopColor="#c8830c" />
        </linearGradient>
        <radialGradient id="hall-door" cx="50%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#5b4426" />
          <stop offset="100%" stopColor="#231708" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse className="art__shadow" cx="160" cy="280" rx="128" ry="24" />

      {/* stone terrace */}
      <path d="M40,278 L58,256 L262,256 L280,278 Z" fill="#bfae8c" />
      <path d="M58,256 L262,256 L262,248 L58,248 Z" fill="#d7c8a6" />
      <path d="M74,248 L246,248 L246,240 L74,240 Z" fill="#cabb99" />

      {/* side wings */}
      <path d="M36,248 L36,180 L86,164 L86,248 Z" fill="url(#hall-side)" />
      <path d="M284,248 L284,180 L234,164 L234,248 Z" fill="url(#hall-side)" />

      {/* main block */}
      <path d="M86,248 L86,150 L234,150 L234,248 Z" fill="url(#hall-stone)" />
      {/* masonry lines */}
      <g stroke="#a08a63" strokeWidth="2" opacity="0.45">
        <path d="M86,178 H234 M86,206 H234 M86,234 H234" />
        <path d="M124,150 V178 M180,178 V206 M124,206 V234 M204,234 V248 M104,234 V248" />
      </g>

      {/* roof over the wings */}
      <path d="M28,182 L86,158 L86,172 L28,196 Z" fill="#8e3120" />
      <path d="M292,182 L234,158 L234,172 L292,196 Z" fill="#75281a" />

      {/* main roof */}
      <path d="M160,72 L252,152 L68,152 Z" fill="url(#hall-roof)" />
      <path d="M160,72 L252,152 L232,152 L160,92 Z" fill="#ffffff" opacity="0.14" />
      <g stroke="#8e3120" strokeWidth="2.6" opacity="0.55">
        <path d="M96,138 L224,138 M84,124 L236,124 M104,110 L216,110" />
      </g>
      <path d="M62,152 L258,152 L258,164 L62,164 Z" fill="#9e3a25" />
      <path d="M62,152 L258,152 L258,157 L62,157 Z" fill="#e08a68" opacity="0.6" />

      {/* roof finial */}
      <g className="art__finial">
        <path d="M160,72 L160,44" stroke="#6d4520" strokeWidth="5" strokeLinecap="round" />
        <circle cx="160" cy="40" r="8" fill="url(#hall-gold)" stroke="#8a5a08" strokeWidth="2" />
      </g>

      {/* banners */}
      <g className="art__banner art__banner--left">
        <path d="M104,164 L128,164 L128,212 L116,202 L104,212 Z" fill="#3f7fd6" />
        <path d="M104,164 L128,164 L128,172 L104,172 Z" fill="#2a5fa8" />
        <circle cx="116" cy="186" r="7" fill="#ffe07a" opacity="0.9" />
      </g>
      <g className="art__banner art__banner--right">
        <path d="M192,164 L216,164 L216,212 L204,202 L192,212 Z" fill="#3f7fd6" />
        <path d="M192,164 L216,164 L216,172 L192,172 Z" fill="#2a5fa8" />
        <circle cx="204" cy="186" r="7" fill="#ffe07a" opacity="0.9" />
      </g>

      {/* the lens emblem: this village's idea of a search engine */}
      <g className="art__lens">
        <circle cx="160" cy="124" r="24" fill="#1d3352" opacity="0.35" />
        <circle
          cx="160"
          cy="122"
          r="22"
          fill="none"
          stroke={gilded ? 'url(#hall-gold)' : '#cbd8ea'}
          strokeWidth="7"
        />
        <circle cx="160" cy="122" r="16" fill="#9fd8f5" opacity="0.55" />
        <path d="M160,108 A14,14 0 0,0 148,126" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.8" strokeLinecap="round" />
        <path
          d="M176,138 L190,152"
          stroke={gilded ? '#e0a017' : '#9fb0c8'}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <rect className="art__lens-glint" x="146" y="108" width="8" height="30" fill="#fff" opacity="0.55" />
      </g>

      {/* doorway */}
      <path d="M136,248 L136,196 A24,24 0 0,1 184,196 L184,248 Z" fill="url(#hall-door)" />
      <path
        d="M136,248 L136,196 A24,24 0 0,1 184,196 L184,248"
        fill="none"
        stroke="#7a5a2e"
        strokeWidth="6"
      />
      <path d="M160,196 L160,248" stroke="#3d2a12" strokeWidth="3" opacity="0.8" />
      <circle cx="152" cy="224" r="3.4" fill="#e9c46a" />
      <circle cx="168" cy="224" r="3.4" fill="#e9c46a" />
      {/* warm light spilling out at night */}
      <path className="win-glow" d="M136,248 L136,200 A24,24 0 0,1 184,200 L184,248 Z" fill="#ffcf7a" opacity="0" />

      {/* braziers */}
      {[62, 258].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 12},248 L${x + 12},248 L${x + 8},224 L${x - 8},224 Z`} fill="#8d99a8" />
          <ellipse cx={x} cy={224} rx="12" ry="5" fill="#5d6678" />
          <g className={`art__flame art__flame--${i}`}>
            <path
              d={`M${x},196 C${x + 11},208 ${x + 9},220 ${x},222 C${x - 9},220 ${x - 11},208 ${x},196 Z`}
              fill="#ff9a2e"
            />
            <path
              d={`M${x},206 C${x + 6},213 ${x + 5},219 ${x},221 C${x - 5},219 ${x - 6},213 ${x},206 Z`}
              fill="#ffe27a"
            />
          </g>
        </g>
      ))}

      {legendary && (
        <g className="art__legendary">
          <circle cx="160" cy="122" r="38" fill="none" stroke="#ffe98a" strokeWidth="3" opacity="0.5" />
        </g>
      )}
    </svg>
  )
}
