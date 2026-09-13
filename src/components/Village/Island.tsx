import { useMemo } from 'react'
import './Island.scss'

/**
 * Outline of the grass plateau in the 1200x700 stage coordinate system: an
 * ellipse with the symmetry knocked out of it so it reads as land, not a disc.
 * Everything placed on the island is checked against this in buildings.ts.
 */
const GRASS_PATH =
  'M600,160 C900,158 1118,266 1106,392 C1094,516 880,616 596,612 C316,608 96,512 92,382 C88,258 320,160 600,160 Z'

const CLIFF_PATH =
  'M92,382 C96,512 316,608 596,612 C880,616 1094,516 1106,392 C1104,472 1020,550 900,594 C818,624 780,662 700,686 C662,698 636,700 600,700 C562,700 538,694 502,682 C428,658 384,620 300,586 C186,542 88,470 92,382 Z'

interface Speck {
  x: number
  y: number
  s: number
  kind: 'tuft' | 'flower' | 'pebble'
}

/** Scatters surface detail inside the plateau with a stable pseudo-random. */
function useGroundDetail(): Speck[] {
  return useMemo(() => {
    const out: Speck[] = []
    for (let i = 0; i < 120; i++) {
      const a = Math.sin(i * 41.17) * 9371.71
      const b = Math.sin(i * 17.53) * 5119.33
      const c = Math.sin(i * 7.91) * 2731.13
      const u = a - Math.floor(a)
      const v = b - Math.floor(b)
      const w = c - Math.floor(c)

      const x = 92 + u * 1016
      const y = 160 + v * 452
      const nx = (x - 600) / 500
      const ny = (y - 385) / 216
      if (nx * nx + ny * ny > 0.9) continue

      out.push({
        x,
        y,
        s: 0.6 + w * 0.8,
        kind: w > 0.88 ? 'flower' : w > 0.76 ? 'pebble' : 'tuft',
      })
    }
    return out
  }, [])
}

export function Island({ animated }: { animated: boolean }) {
  const detail = useGroundDetail()

  return (
    <svg className="island" viewBox="0 0 1200 700" aria-hidden="true">
      <defs>
        <linearGradient id="grass-top" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#8fd85f" />
          <stop offset="42%" stopColor="#6ec247" />
          <stop offset="100%" stopColor="#4f9f38" />
        </linearGradient>
        <linearGradient id="cliff-face" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a9763f" />
          <stop offset="34%" stopColor="#8a5a2f" />
          <stop offset="100%" stopColor="#4d2f18" />
        </linearGradient>
        <radialGradient id="pond-water" cx="40%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#9fe4ff" />
          <stop offset="60%" stopColor="#48b6e8" />
          <stop offset="100%" stopColor="#2a7fb8" />
        </radialGradient>
        <linearGradient id="path-dirt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8b177" />
          <stop offset="100%" stopColor="#b38a52" />
        </linearGradient>
        <filter id="island-drop" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="26" stdDeviation="26" floodColor="#0a1430" floodOpacity="0.45" />
        </filter>
        <clipPath id="grass-clip">
          <path d={GRASS_PATH} />
        </clipPath>
      </defs>

      <g filter="url(#island-drop)">
        {/* Rock underside */}
        <path d={CLIFF_PATH} fill="url(#cliff-face)" />
        <g opacity="0.4" fill="#3c2513">
          <path d="M494,660 L540,648 L572,700 L514,700 Z" />
          <path d="M636,650 L688,632 L722,680 L660,698 Z" />
          <path d="M336,594 L384,604 L432,656 L372,640 Z" />
          <path d="M840,590 L890,574 L914,620 L858,640 Z" />
        </g>
        <g opacity="0.32" fill="#e2b476">
          <path d="M240,540 L292,560 L302,592 L250,572 Z" />
          <path d="M918,540 L968,556 L958,590 L906,572 Z" />
        </g>
        {/* Roots poking through the cliff */}
        <g stroke="#3f2711" strokeWidth="6" fill="none" opacity="0.45" strokeLinecap="round">
          <path d="M498,606 C512,640 500,664 514,690" />
          <path d="M704,612 C718,646 706,668 720,692" />
        </g>

        {/* Grass plateau */}
        <path d={GRASS_PATH} fill="url(#grass-top)" />
        <path d={GRASS_PATH} fill="none" stroke="#3f8c2c" strokeWidth="9" opacity="0.55" />
        <path
          d="M240,270 C360,186 500,160 600,160 C760,159 900,196 1000,254"
          fill="none"
          stroke="#b9ec86"
          strokeWidth="11"
          opacity="0.5"
          strokeLinecap="round"
        />

        <g clipPath="url(#grass-clip)">
          {/* Broad shading so the plateau does not read as flat */}
          <ellipse cx="600" cy="222" rx="500" ry="130" fill="#a9ec7c" opacity="0.24" />
          <ellipse cx="600" cy="560" rx="500" ry="150" fill="#2f7a24" opacity="0.26" />
          <ellipse cx="330" cy="470" rx="200" ry="110" fill="#2f7a24" opacity="0.1" />

          {/* Winding path up to the Search Hall */}
          <path
            d="M600,620 C572,566 654,530 636,486 C618,442 540,432 548,396 C556,360 596,356 600,338"
            fill="none"
            stroke="url(#path-dirt)"
            strokeWidth="46"
            strokeLinecap="round"
          />
          <path
            d="M600,620 C572,566 654,530 636,486 C618,442 540,432 548,396 C556,360 596,356 600,338"
            fill="none"
            stroke="#e8caa0"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="18 26"
            opacity="0.7"
          />

          {/* Pond, tucked into the back field */}
          <g className="pond">
            <ellipse cx="418" cy="256" rx="84" ry="38" fill="#3f7f2c" opacity="0.6" />
            <ellipse cx="418" cy="252" rx="75" ry="31" fill="url(#pond-water)" />
            <ellipse
              cx="400"
              cy="244"
              rx="34"
              ry="10"
              fill="#ffffff"
              opacity="0.45"
              className={animated ? 'pond__shine' : undefined}
            />
          </g>

          {/* Ground detail */}
          <g>
            {detail.map((d, i) =>
              d.kind === 'tuft' ? (
                <path
                  key={i}
                  d={`M${d.x},${d.y} l${-4 * d.s},${-9 * d.s} M${d.x},${d.y} l0,${-12 * d.s} M${d.x},${d.y} l${4 * d.s},${-8 * d.s}`}
                  stroke="#3f8c2c"
                  strokeWidth={2.2 * d.s}
                  strokeLinecap="round"
                  opacity="0.5"
                />
              ) : d.kind === 'flower' ? (
                <g key={i} opacity="0.9">
                  <circle cx={d.x} cy={d.y} r={3.4 * d.s} fill={i % 3 === 0 ? '#ffd94f' : '#ff8fb6'} />
                  <circle cx={d.x} cy={d.y} r={1.3 * d.s} fill="#fff6d0" />
                </g>
              ) : (
                <ellipse
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  rx={5 * d.s}
                  ry={3 * d.s}
                  fill="#8a9a86"
                  opacity="0.55"
                />
              ),
            )}
          </g>
        </g>
      </g>
    </svg>
  )
}
