import type { TroopKind } from '@/types'

/**
 * Original attacker designs for the war replay. Each one keeps its moving
 * parts in named groups so War.scss can drive the march and the swing.
 */
export function TroopArt({ kind }: { kind: TroopKind }) {
  if (kind === 'slinger') return <Slinger />
  if (kind === 'boulder') return <Boulder />
  return <Brute />
}

function Brute() {
  return (
    <svg viewBox="0 0 100 132" className="troop__svg">
      <defs>
        <linearGradient id="tr-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0c089" />
          <stop offset="100%" stopColor="#cf9257" />
        </linearGradient>
        <linearGradient id="tr-vest" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a9713c" />
          <stop offset="60%" stopColor="#7d4c21" />
          <stop offset="100%" stopColor="#4f2d11" />
        </linearGradient>
        <linearGradient id="tr-steel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e6ecf7" />
          <stop offset="55%" stopColor="#9aa3b4" />
          <stop offset="100%" stopColor="#596274" />
        </linearGradient>
      </defs>

      <ellipse className="troop__shadow" cx="50" cy="122" rx="24" ry="6" />

      <g className="troop__body">
        <g className="troop__leg troop__leg--back">
          <path d="M43,86 L43,110" stroke="#5c3a1c" strokeWidth="12" strokeLinecap="round" />
          <path d="M35,116 q8,-7 15,-2 l0,7 l-17,0 Z" fill="#3d2612" />
        </g>
        <g className="troop__leg troop__leg--front">
          <path d="M59,86 L59,112" stroke="#6b4423" strokeWidth="12" strokeLinecap="round" />
          <path d="M51,118 q9,-7 17,-2 l0,7 l-19,0 Z" fill="#4a2d15" />
        </g>

        <g className="troop__arm troop__arm--back">
          <path d="M38,56 L28,80" stroke="#cf9257" strokeWidth="10" strokeLinecap="round" />
        </g>

        <g className="troop__torso">
          <path d="M36,90 L32,50 Q50,42 68,50 L64,90 Z" fill="url(#tr-vest)" />
          <path d="M52,44 L64,90 L54,90 L46,46 Z" fill="#000" opacity="0.14" />
          <rect x="33" y="80" width="34" height="10" rx="4" fill="#3d2612" />
          <rect x="44" y="79" width="12" height="12" rx="3" fill="#c8830c" />
          {/* chest strap */}
          <path d="M36,52 L62,80" stroke="#3d2612" strokeWidth="5" opacity="0.8" />

          <g className="troop__head">
            <ellipse cx="50" cy="32" rx="17" ry="16" fill="url(#tr-skin)" />
            {/* headband */}
            <path d="M33,27 q17,-8 34,0 l0,6 q-17,-7 -34,0 Z" fill="#c03a2b" />
            <path d="M65,29 l10,3 -3,7 -8,-5 Z" fill="#c03a2b" />
            {/* eyes */}
            <ellipse cx="44" cy="34" rx="3.6" ry="4" fill="#fff" />
            <ellipse cx="56" cy="34" rx="3.6" ry="4" fill="#fff" />
            <circle cx="44.6" cy="35" r="2" fill="#2a1c10" />
            <circle cx="56.6" cy="35" r="2" fill="#2a1c10" />
            {/* beard */}
            <path d="M35,42 q15,10 30,0 q-3,18 -15,18 q-12,0 -15,-18 Z" fill="#33240f" />
            <path d="M40,41 q10,6 20,0 q-2,6 -10,6 q-8,0 -10,-6 Z" fill="#241907" />
          </g>
        </g>

        <g className="troop__arm troop__arm--front">
          <path d="M64,56 L78,74" stroke="#e0a870" strokeWidth="11" strokeLinecap="round" />
          <g className="troop__weapon">
            <path d="M80,76 L86,64" stroke="#5c3a1c" strokeWidth="7" strokeLinecap="round" />
            <path d="M70,66 L96,60" stroke="#8a5a33" strokeWidth="5" strokeLinecap="round" />
            <path d="M84,60 L92,18 L99,60 Z" fill="url(#tr-steel)" stroke="#4b5468" strokeWidth="2" />
            <path d="M89,56 L92,22 L94,56 Z" fill="#fff" opacity="0.4" />
          </g>
        </g>
      </g>
    </svg>
  )
}

function Slinger() {
  return (
    <svg viewBox="0 0 100 126" className="troop__svg">
      <defs>
        <linearGradient id="tr-cloak" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#64b36a" />
          <stop offset="55%" stopColor="#3d8a4a" />
          <stop offset="100%" stopColor="#235a2e" />
        </linearGradient>
      </defs>

      <ellipse className="troop__shadow" cx="50" cy="118" rx="20" ry="5" />

      <g className="troop__body">
        <g className="troop__leg troop__leg--back">
          <path d="M45,84 L44,106" stroke="#4a3b22" strokeWidth="9" strokeLinecap="round" />
          <path d="M37,112 q8,-6 14,-2 l0,6 l-16,0 Z" fill="#332715" />
        </g>
        <g className="troop__leg troop__leg--front">
          <path d="M57,84 L58,108" stroke="#5c4a2c" strokeWidth="9" strokeLinecap="round" />
          <path d="M50,114 q8,-6 15,-2 l0,6 l-17,0 Z" fill="#42341c" />
        </g>

        <g className="troop__arm troop__arm--back">
          <path d="M40,54 L30,72" stroke="#3d8a4a" strokeWidth="8" strokeLinecap="round" />
        </g>

        <g className="troop__torso">
          {/* cloak */}
          <path d="M36,88 L34,48 Q50,40 66,48 L64,88 Z" fill="url(#tr-cloak)" />
          <path d="M52,42 L64,88 L56,88 L48,44 Z" fill="#000" opacity="0.14" />
          <rect x="34" y="78" width="32" height="8" rx="4" fill="#2e2312" />
          {/* quiver */}
          <path d="M64,50 L74,74" stroke="#6b4423" strokeWidth="9" strokeLinecap="round" />
          <path d="M66,50 L70,42 M69,51 L74,44 M72,53 L78,47" stroke="#d8d2c4" strokeWidth="2.6" strokeLinecap="round" />

          <g className="troop__head">
            <ellipse cx="50" cy="34" rx="14" ry="13" fill="#f0c089" />
            {/* hood */}
            <path d="M50,14 q18,3 18,20 q0,7 -4,9 l-6,-4 q3,-10 -8,-13 q-11,3 -8,13 l-6,4 q-4,-2 -4,-9 q0,-17 18,-20 Z" fill="url(#tr-cloak)" />
            <path d="M50,14 q18,3 18,20 q0,7 -4,9 l-4,-3 q4,-16 -10,-24 Z" fill="#000" opacity="0.16" />
            <ellipse cx="45" cy="36" rx="3" ry="3.4" fill="#fff" />
            <ellipse cx="55" cy="36" rx="3" ry="3.4" fill="#fff" />
            <circle cx="45.5" cy="36.8" r="1.7" fill="#2a1c10" />
            <circle cx="55.5" cy="36.8" r="1.7" fill="#2a1c10" />
            {/* scarf */}
            <path d="M38,44 q12,7 24,0 q-2,8 -12,8 q-10,0 -12,-8 Z" fill="#2f7a3f" />
          </g>
        </g>

        <g className="troop__arm troop__arm--front">
          <path d="M64,54 L76,66" stroke="#e0a870" strokeWidth="8" strokeLinecap="round" />
          <g className="troop__weapon">
            <path d="M80,40 q14,26 0,52" fill="none" stroke="#8a5a33" strokeWidth="5" strokeLinecap="round" />
            <path d="M80,40 L80,92" stroke="#e6ecf7" strokeWidth="1.8" opacity="0.8" />
            <path d="M72,66 L96,66" stroke="#d8d2c4" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M96,66 L90,62 M96,66 L90,70" stroke="#d8d2c4" strokeWidth="2.6" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  )
}

function Boulder() {
  return (
    <svg viewBox="0 0 140 150" className="troop__svg">
      <defs>
        <linearGradient id="tr-rock" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#b7c2cf" />
          <stop offset="48%" stopColor="#7f8b9c" />
          <stop offset="100%" stopColor="#4a5466" />
        </linearGradient>
      </defs>

      <ellipse className="troop__shadow" cx="70" cy="138" rx="36" ry="8" />

      <g className="troop__body">
        <g className="troop__leg troop__leg--back">
          <path d="M56,104 L54,126" stroke="#5c6678" strokeWidth="20" strokeLinecap="round" />
          <path d="M42,132 q12,-8 24,-3 l0,8 l-26,0 Z" fill="#3b4352" />
        </g>
        <g className="troop__leg troop__leg--front">
          <path d="M86,104 L88,128" stroke="#6c7789" strokeWidth="20" strokeLinecap="round" />
          <path d="M74,134 q13,-8 26,-3 l0,8 l-28,0 Z" fill="#49525f" />
        </g>

        <g className="troop__torso">
          <path d="M40,110 Q32,58 70,50 Q108,58 100,110 Z" fill="url(#tr-rock)" />
          <path d="M78,52 Q104,62 100,110 L84,110 Q90,70 74,52 Z" fill="#000" opacity="0.16" />
          {/* cracks */}
          <path d="M56,66 L62,80 L54,88 M88,72 L82,84 L90,96" stroke="#3b4352" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
          {/* moss, because he is old */}
          <path d="M44,92 q10,-5 18,2 q-9,6 -18,-2 Z" fill="#4f9f38" opacity="0.7" />

          <g className="troop__head">
            <ellipse cx="70" cy="38" rx="22" ry="19" fill="url(#tr-rock)" />
            <path d="M52,30 q18,-8 36,0 l0,-4 q-18,-9 -36,0 Z" fill="#98a3b3" />
            <ellipse cx="61" cy="40" rx="5" ry="5.4" fill="#0f1520" />
            <ellipse cx="79" cy="40" rx="5" ry="5.4" fill="#0f1520" />
            <circle cx="62" cy="39" r="2.2" fill="#ffe07a" />
            <circle cx="80" cy="39" r="2.2" fill="#ffe07a" />
            <path d="M60,52 q10,6 20,0" stroke="#3b4352" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </g>

        <g className="troop__arm troop__arm--back">
          <path d="M44,62 L26,92" stroke="#6c7789" strokeWidth="17" strokeLinecap="round" />
          <circle cx="24" cy="96" r="12" fill="#8b96a8" />
        </g>
        <g className="troop__arm troop__arm--front">
          <path d="M96,62 L116,90" stroke="#8b96a8" strokeWidth="18" strokeLinecap="round" />
          <g className="troop__weapon">
            <circle cx="119" cy="95" r="14" fill="#a3aebe" />
            <circle cx="115" cy="91" r="5" fill="#c8d2e0" opacity="0.7" />
          </g>
        </g>
      </g>
    </svg>
  )
}
