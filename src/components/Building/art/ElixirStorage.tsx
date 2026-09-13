import type { ArtProps } from './types'

const BUBBLES = [
  { x: 76, r: 5, delay: 0, duration: 4.2 },
  { x: 98, r: 7, delay: 1.4, duration: 5.1 },
  { x: 120, r: 4, delay: 2.6, duration: 3.8 },
  { x: 88, r: 3.4, delay: 3.4, duration: 4.6 },
  { x: 110, r: 5.6, delay: 0.8, duration: 5.6 },
]

const TANK = 'M54,198 L54,104 A46,46 0 0,1 146,104 L146,198 Z'

/** Do not drink the elixir. */
export function ElixirStorage({ level, active }: ArtProps) {
  // Each level raises the surface: the upgrade you can actually see.
  const surface = 126 - Math.min(level, 3) * 8
  return (
    <svg viewBox="0 0 200 250" className={`art art--elixir ${active ? 'is-active' : ''}`}>
      <defs>
        <linearGradient id="es-glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="26%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#41215e" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="es-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e79bff" />
          <stop offset="42%" stopColor="#b845f0" />
          <stop offset="100%" stopColor="#63139f" />
        </linearGradient>
        <linearGradient id="es-metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d3dae7" />
          <stop offset="46%" stopColor="#8c96aa" />
          <stop offset="100%" stopColor="#4c5566" />
        </linearGradient>
        <clipPath id="es-tank-clip">
          <path d={TANK} />
        </clipPath>
      </defs>

      <ellipse className="art__shadow" cx="100" cy="224" rx="74" ry="16" />

      {/* stone base */}
      <path d="M34,222 L44,204 L156,204 L166,222 Z" fill="#9d8c70" />
      <path d="M44,204 L156,204 L150,194 L50,194 Z" fill="#bfae8c" />

      {/* glass tank */}
      <path d={TANK} fill="#f2e6ff" opacity="0.35" />
      <g clipPath="url(#es-tank-clip)">
        <path d={`M54,198 L54,${surface} L146,${surface} L146,198 Z`} fill="url(#es-liquid)" />
        <ellipse cx="100" cy={surface} rx="46" ry="11" fill="#dc9dff" />
        <ellipse cx="100" cy={surface - 1} rx="30" ry="5.5" fill="#f6dcff" opacity="0.65" />
        <g className="art__bubbles">
          {BUBBLES.map((b, i) => (
            <circle
              key={i}
              className="bubble"
              cx={b.x}
              cy={192}
              r={b.r}
              fill="#f6dcff"
              opacity="0.75"
              style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
            />
          ))}
        </g>
        {/* sediment at the bottom, because nobody cleans this */}
        <ellipse cx="100" cy="200" rx="46" ry="10" fill="#3f0c66" opacity="0.4" />
      </g>
      <path d={TANK} fill="url(#es-glass)" />
      <path
        d="M70,186 L70,112 A30,30 0 0,1 84,90"
        stroke="#ffffff"
        strokeWidth="7"
        opacity="0.45"
        fill="none"
        strokeLinecap="round"
      />
      <path d={TANK} fill="none" stroke="#7c6a94" strokeWidth="3" opacity="0.4" />

      {/* metal hoops */}
      <rect x="48" y="190" width="104" height="14" rx="6" fill="url(#es-metal)" />
      <rect x="50" y="140" width="100" height="9" rx="4" fill="url(#es-metal)" opacity="0.9" />
      {[62, 100, 138].map((x) => (
        <circle key={x} cx={x} cy={197} r="2.8" fill="#eef2fa" opacity="0.85" />
      ))}

      {/* cap, valve and outlet pipe */}
      <path d="M74,74 L126,74 L122,60 L78,60 Z" fill="url(#es-metal)" />
      <rect x="70" y="72" width="60" height="12" rx="5" fill="url(#es-metal)" />
      <path d="M100,60 L100,44 L142,44 L142,66" stroke="url(#es-metal)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="142" cy="70" r="9" fill="#8e99ab" stroke="#4c5566" strokeWidth="3" />
      <g className="art__valve">
        <circle cx="100" cy="44" r="10" fill="none" stroke="#dfe6f2" strokeWidth="3.4" />
        <path d="M90,44 H110 M100,34 V54" stroke="#dfe6f2" strokeWidth="3.4" strokeLinecap="round" />
      </g>

      {/* drip */}
      <circle className="art__drip" cx="142" cy="82" r="4.4" fill="#c86bf0" />
    </svg>
  )
}
