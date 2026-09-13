import { WALL_TIERS } from '@/data/jokes'

export function wallTierOf(level: number): number {
  let tier = 0
  WALL_TIERS.forEach((t, i) => {
    if (level >= t.at) tier = i
  })
  return tier
}

export function wallLabelOf(level: number): string {
  return WALL_TIERS[wallTierOf(level)]?.label ?? 'Wall'
}

interface Palette {
  face: string
  faceDark: string
  top: string
  seam: string
}

const PALETTES: Palette[] = [
  { face: '#cfc8b8', faceDark: '#9d9587', top: '#e4ddcc', seam: '#8d8578' },
  { face: '#c3c8cf', faceDark: '#8e939c', top: '#dde2e9', seam: '#7f858e' },
  { face: '#9fa8b8', faceDark: '#6c7585', top: '#c0c8d6', seam: '#5c6474' },
  { face: '#a6dcea', faceDark: '#5ba3bd', top: '#d2f0f8', seam: '#4a8ca6' },
  { face: '#7a4a38', faceDark: '#46251c', top: '#96604a', seam: '#341a13' },
  { face: '#6f4335', faceDark: '#3d2019', top: '#8b5744', seam: '#2c1610' },
  { face: '#f0c357', faceDark: '#b8831a', top: '#ffe08a', seam: '#9c6c10' },
  { face: '#ffd672', faceDark: '#c48d1c', top: '#fff0b4', seam: '#a5740e' },
  { face: '#ffe08a', faceDark: '#cf941d', top: '#fff6cf', seam: '#b07c0c' },
  { face: '#fff0b4', faceDark: '#e0a417', top: '#fffbe6', seam: '#c08a0c' },
]

/** The click-to-upgrade wall. It escalates. */
export function WallSegment({ level }: { level: number }) {
  const tier = wallTierOf(level)
  const p = PALETTES[Math.min(tier, PALETTES.length - 1)]!
  const molten = tier === 4 || tier === 5
  const crystal = tier === 3
  const spikes = tier >= 5
  const aura = tier >= 7

  return (
    <svg viewBox="0 0 170 160" className={`art art--wall tier-${tier}`}>
      <ellipse className="art__shadow" cx="85" cy="146" rx="62" ry="12" />

      {aura && <ellipse className="art__wall-aura" cx="85" cy="92" rx="70" ry="54" fill="#ffe98a" opacity="0.18" />}

      {/* front face */}
      <path d="M26,142 L26,74 L144,74 L144,142 Z" fill={p.face} />
      <path d="M122,74 L144,74 L144,142 L122,142 Z" fill={p.faceDark} />
      {/* top face, slightly isometric */}
      <path d="M26,74 L44,60 L162,60 L144,74 Z" fill={p.top} />

      {/* crenellations */}
      {[0, 1, 2, 3].map((i) => {
        const x = 26 + i * 32
        return (
          <g key={i}>
            <path d={`M${x},74 L${x},56 L${x + 20},56 L${x + 20},74 Z`} fill={p.face} />
            <path d={`M${x},56 L${x + 12},46 L${x + 32},46 L${x + 20},56 Z`} fill={p.top} />
            <path d={`M${x + 20},56 L${x + 32},46 L${x + 32},64 L${x + 20},74 Z`} fill={p.faceDark} />
          </g>
        )
      })}

      {/* masonry seams */}
      <g stroke={p.seam} strokeWidth="2.4" opacity="0.6">
        <path d="M26,96 H144 M26,118 H144" />
        <path d="M62,74 V96 M98,96 V118 M62,118 V142 M120,118 V142" />
      </g>

      {molten && (
        <g className="art__lava">
          <path
            d="M40,142 L52,118 L46,110 L60,96 M104,142 L96,120 L108,108 L100,94"
            stroke="#ff7a1a"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M26,74 L162,60" stroke="#ff9a2e" strokeWidth="3" opacity="0.7" />
        </g>
      )}

      {crystal &&
        [46, 84, 122].map((x, i) => (
          <g key={x} className={`art__crystal art__crystal--${i}`}>
            <path d={`M${x},50 L${x + 9},30 L${x + 18},50 L${x + 9},58 Z`} fill="#9befff" opacity="0.92" />
            <path d={`M${x + 9},30 L${x + 18},50 L${x + 9},58 Z`} fill="#55c4e8" />
          </g>
        ))}

      {spikes &&
        [40, 78, 116].map((x) => (
          <g key={x}>
            <path d={`M${x},52 L${x + 8},18 L${x + 16},52 Z`} fill="#3f4654" />
            <path d={`M${x + 8},18 L${x + 16},52 L${x + 8},48 Z`} fill="#1e232d" />
          </g>
        ))}

      {tier >= 8 && (
        <g className="art__sparkles">
          <path className="sparkle sparkle--0" d="M34,34 l3,6.6 6.6,3 -6.6,3 -3,6.6 -3,-6.6 -6.6,-3 6.6,-3 Z" fill="#fff6c9" />
          <path className="sparkle sparkle--1" d="M140,28 l2.4,5.4 5.4,2.4 -5.4,2.4 -2.4,5.4 -2.4,-5.4 -5.4,-2.4 5.4,-2.4 Z" fill="#fff6c9" />
        </g>
      )}
    </svg>
  )
}
