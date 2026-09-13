import type { AttackerKind } from '@/types'

/**
 * The besieging objects. Each one is a floating operator or function space with
 * a large, legible glyph and one signature motion, so they read at a glance
 * even at 120px on a busy village.
 */
export function AttackerArt({ kind }: { kind: AttackerKind }) {
  switch (kind) {
    case 'bochner':
      return <Bochner />
    case 'sobolev':
      return <Sobolev />
    case 'dirac':
      return <Dirac />
    case 'navier':
      return <Navier />
    case 'heat':
      return <Heat />
    case 'gradient':
      return <Gradient />
    default:
      return <Laplacian />
  }
}

/**
 * Shared bits: a faint ground shadow and the glyph typeface.
 *
 * Upright, not italic. Operators and space names are set roman in mathematical
 * typography, and an italic Δ or ∇ slants one edge to vertical — which reads as
 * a right-angled triangle sitting crooked inside a symmetric one.
 */
const GLYPH = {
  fontFamily: "'Cambria Math', 'Latin Modern Math', 'Times New Roman', serif",
  fontStyle: 'normal' as const,
  textAnchor: 'middle' as const,
  dominantBaseline: 'central' as const,
}

/**
 * Rounded triangles, built once so both the Laplacian and the gradient read as
 * deliberate shapes rather than raw polygons with mitred corners.
 * Apex (60,16), base (18,92)-(102,92), corner radius ~11.
 */
const ROUNDED_TRIANGLE =
  'M65.4,25.6 L96.6,82.4 Q102,92 91,92 L29,92 Q18,92 23.4,82.4 L54.6,25.6 Q60,16 65.4,25.6 Z'

/** The same shape flipped: base (18,26)-(102,26), apex (60,102). */
const ROUNDED_NABLA =
  'M54.6,92.4 L23.4,35.6 Q18,26 29,26 L91,26 Q102,26 96.6,35.6 L65.4,92.4 Q60,102 54.6,92.4 Z'

function Shadow({ cy = 126, rx = 26 }: { cy?: number; rx?: number }) {
  return <ellipse className="attacker__shadow" cx="60" cy={cy} rx={rx} ry="6" />
}

function Laplacian() {
  return (
    <svg viewBox="0 0 120 136" className="attacker__svg">
      <defs>
        <linearGradient id="at-lap" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#8b6ff0" />
          <stop offset="55%" stopColor="#5b3fc4" />
          <stop offset="100%" stopColor="#2e1c72" />
        </linearGradient>
      </defs>
      <Shadow />

      <g className="attacker__float">
        {/* diffusion rings: this one spreads, that is its whole personality */}
        <g className="attacker__rings">
          <circle className="ring ring--0" cx="60" cy="58" r="34" />
          <circle className="ring ring--1" cx="60" cy="58" r="34" />
        </g>

        {/* Rounded isoceles triangle: apex (60,16), base (18,92)-(102,92).
            One path with a centred stroke, so the outline is the same width
            everywhere and the shape stays mirror-symmetric about x = 60. */}
        <path
          d={ROUNDED_TRIANGLE}
          fill="url(#at-lap)"
          stroke="#1c1048"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M60,27 L77,56 L43,56 Z" fill="#ffffff" opacity="0.17" />
        <text {...GLYPH} x="60" y="56" fontSize="34" fill="#f6f1ff">
          Δ
        </text>
        <ellipse cx="51" cy="78" rx="4.6" ry="5.4" fill="#160c3a" />
        <ellipse cx="69" cy="78" rx="4.6" ry="5.4" fill="#160c3a" />
        <circle cx="52.4" cy="76.4" r="1.7" fill="#c7b3ff" />
        <circle cx="70.4" cy="76.4" r="1.7" fill="#c7b3ff" />
      </g>
    </svg>
  )
}

function Bochner() {
  // A stack of time slices, each one a Hilbert space. Very tidy. Very hostile.
  const plates = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 120 136" className="attacker__svg">
      <defs>
        <linearGradient id="at-boch" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4fe0d0" />
          <stop offset="60%" stopColor="#1c9fb4" />
          <stop offset="100%" stopColor="#0d5a78" />
        </linearGradient>
      </defs>
      <Shadow rx={30} />

      <g className="attacker__float">
        {plates.map((i) => (
          <g key={i} className={`plate plate--${i}`}>
            <ellipse
              cx="60"
              cy={92 - i * 19}
              rx="38"
              ry="11"
              fill="url(#at-boch)"
              stroke="#08384d"
              strokeWidth="3"
              opacity={0.92 - i * 0.08}
            />
            <ellipse cx="54" cy={89 - i * 19} rx="16" ry="4" fill="#ffffff" opacity="0.32" />
          </g>
        ))}
        {/* the time axis skewering them */}
        <path d="M60,102 L60,14" stroke="#08384d" strokeWidth="4" strokeLinecap="round" />
        <path d="M60,10 L54,22 L66,22 Z" fill="#08384d" />
        <text {...GLYPH} x="60" y="40" fontSize="24" fill="#eafcff" stroke="#08384d" strokeWidth="1">
          L²
        </text>
        <text {...GLYPH} x="60" y="60" fontSize="15" fill="#d6f7ff" stroke="#08384d" strokeWidth="0.6">
          (0,T;H¹₀)
        </text>
        <text {...GLYPH} x="94" y="20" fontSize="17" fill="#bdf2ff">
          T
        </text>
      </g>
    </svg>
  )
}

function Sobolev() {
  return (
    <svg viewBox="0 0 120 136" className="attacker__svg">
      <defs>
        <linearGradient id="at-sob" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="55%" stopColor="#e08b1f" />
          <stop offset="100%" stopColor="#8c4a06" />
        </linearGradient>
      </defs>
      <Shadow rx={28} />

      <g className="attacker__float">
        <g className="attacker__spin">
          {/* An isometric cube: the embedding is compact, the cube is not. */}
          <path
            d="M30,48 H82 V100 H30 Z M48,30 H100 V82 H48 Z M30,48 L48,30 M82,48 L100,30 M82,100 L100,82 M30,100 L48,82"
            fill="none"
            stroke="url(#at-sob)"
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
        <text {...GLYPH} x="56" y="74" fontSize="30" fill="#fff3d0" stroke="#7a3f05" strokeWidth="1.2">
          W
        </text>
        <text {...GLYPH} x="79" y="63" fontSize="15" fill="#ffe7a8" stroke="#7a3f05" strokeWidth="0.6">
          1,p
        </text>
      </g>
    </svg>
  )
}

function Dirac() {
  return (
    <svg viewBox="0 0 120 136" className="attacker__svg">
      <defs>
        <linearGradient id="at-dirac" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3c2a70" />
          <stop offset="55%" stopColor="#9b6bff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <Shadow rx={18} />

      <g className="attacker__float">
        {/* mass one, support nowhere, opinions strong */}
        <path d="M52,108 L60,8 L68,108 Z" fill="url(#at-dirac)" stroke="#2a1a55" strokeWidth="3" strokeLinejoin="round" />
        <circle className="attacker__spike" cx="60" cy="10" r="8" fill="#ffffff" />
        <path d="M28,108 L92,108" stroke="#2a1a55" strokeWidth="4" strokeLinecap="round" />
        <text {...GLYPH} x="38" y="92" fontSize="26" fill="#e6dcff" stroke="#2a1a55" strokeWidth="1">
          δ
        </text>
        <text {...GLYPH} x="50" y="100" fontSize="13" fill="#c6b2ff">
          0
        </text>
      </g>
    </svg>
  )
}

function Navier() {
  return (
    <svg viewBox="0 0 120 136" className="attacker__svg">
      <defs>
        <radialGradient id="at-nav" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#d6f4ff" />
          <stop offset="45%" stopColor="#37a8e0" />
          <stop offset="100%" stopColor="#12456e" />
        </radialGradient>
      </defs>
      <Shadow rx={30} />

      <g className="attacker__float">
        <g className="attacker__vortex">
          <circle cx="60" cy="60" r="40" fill="url(#at-nav)" stroke="#0d3453" strokeWidth="4" />
          <path
            d="M60,24 C82,30 88,52 74,66 C64,76 48,72 46,60 C45,52 52,46 58,50"
            fill="none"
            stroke="#eaf9ff"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M28,68 C40,86 74,90 90,74"
            fill="none"
            stroke="#bfe9ff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
        <text {...GLYPH} x="60" y="106" fontSize="20" fill="#eaf9ff" stroke="#0d3453" strokeWidth="1">
          u·∇u
        </text>
      </g>
    </svg>
  )
}

function Heat() {
  return (
    <svg viewBox="0 0 120 136" className="attacker__svg">
      <defs>
        <radialGradient id="at-heat" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="45%" stopColor="#ff9a2e" />
          <stop offset="100%" stopColor="#a83208" />
        </radialGradient>
      </defs>
      <Shadow rx={28} />

      <g className="attacker__float">
        <g className="attacker__rings attacker__rings--warm">
          <circle className="ring ring--0" cx="60" cy="58" r="32" />
          <circle className="ring ring--1" cx="60" cy="58" r="32" />
        </g>
        <circle cx="60" cy="58" r="34" fill="url(#at-heat)" stroke="#6d2205" strokeWidth="4" />
        <text {...GLYPH} x="60" y="58" fontSize="30" fill="#4a1600">
          ∂ₜ
        </text>
        <path
          d="M36,98 q8,-10 16,0 t16,0 t16,0"
          fill="none"
          stroke="#ffb45e"
          strokeWidth="4"
          strokeLinecap="round"
          className="attacker__waves"
        />
      </g>
    </svg>
  )
}

function Gradient() {
  return (
    <svg viewBox="0 0 120 136" className="attacker__svg">
      <defs>
        <linearGradient id="at-grad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ff7ab0" />
          <stop offset="55%" stopColor="#d6206e" />
          <stop offset="100%" stopColor="#6d0a37" />
        </linearGradient>
      </defs>
      <Shadow rx={26} />

      <g className="attacker__float">
        <path
          d={ROUNDED_NABLA}
          fill="url(#at-grad)"
          stroke="#4a0725"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M27,34 L93,34 L85,49 L35,49 Z" fill="#ffffff" opacity="0.17" />
        <text {...GLYPH} x="60" y="52" fontSize="34" fill="#ffe6f1">
          ∇
        </text>
        {/* it is blowing up, so it should look like it */}
        <g className="attacker__blowup">
          <path d="M60,104 L60,126 M46,98 L34,116 M74,98 L86,116" stroke="#ff9ec8" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}
