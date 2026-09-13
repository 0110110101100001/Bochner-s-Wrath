/**
 * The Builder. Original character: a stout worker in a wide leather hat with a
 * hammer he would rather put down.
 *
 * Every moving part is its own <g> so the mood classes in Builder.scss can
 * animate them with transforms only.
 */
export function BuilderArt() {
  return (
    <svg viewBox="0 0 120 176" className="builder__svg">
      <defs>
        <linearGradient id="bd-tunic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6fc94f" />
          <stop offset="55%" stopColor="#4ea337" />
          <stop offset="100%" stopColor="#2f7a25" />
        </linearGradient>
        <linearGradient id="bd-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd9a8" />
          <stop offset="100%" stopColor="#e0a870" />
        </linearGradient>
        <linearGradient id="bd-hat" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#b98246" />
          <stop offset="55%" stopColor="#8a5a2c" />
          <stop offset="100%" stopColor="#5a3718" />
        </linearGradient>
        <linearGradient id="bd-steel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f4" />
          <stop offset="50%" stopColor="#9aa3b4" />
          <stop offset="100%" stopColor="#5d6678" />
        </linearGradient>
      </defs>

      <ellipse className="builder__shadow" cx="60" cy="163" rx="30" ry="7" />

      <g className="builder__body-root">
        {/* back leg */}
        <g className="builder__leg builder__leg--back">
          <path d="M52,108 L52,142" stroke="#3c6f2a" strokeWidth="13" strokeLinecap="round" />
          <path d="M44,148 q8,-8 16,-2 l0,8 l-18,0 Z" fill="#4a2d15" />
        </g>

        {/* front leg */}
        <g className="builder__leg builder__leg--front">
          <path d="M70,108 L70,144" stroke="#4a8a33" strokeWidth="13" strokeLinecap="round" />
          <path d="M62,150 q9,-8 18,-2 l0,8 l-20,0 Z" fill="#5c3a1c" />
        </g>

        {/* back arm */}
        <g className="builder__arm builder__arm--back">
          <path d="M44,74 L34,104" stroke="#3c8a2c" strokeWidth="11" strokeLinecap="round" />
          <circle cx="33" cy="107" r="7" fill="url(#bd-skin)" />
        </g>

        <g className="builder__torso">
          {/* tunic */}
          <path d="M38,112 L43,66 Q60,58 77,66 L82,112 Z" fill="url(#bd-tunic)" />
          <path d="M66,60 L82,112 L70,112 L60,62 Z" fill="#000" opacity="0.12" />
          {/* collar */}
          <path d="M50,64 Q60,74 70,64" fill="none" stroke="#2f7a25" strokeWidth="3.6" />
          {/* belt */}
          <rect x="36" y="104" width="48" height="12" rx="4" fill="#6a4423" />
          <rect x="52" y="103" width="16" height="14" rx="3" fill="#e0a417" stroke="#9c6c10" strokeWidth="2" />
          {/* pouch */}
          <path d="M78,112 q10,2 9,13 q-9,3 -13,-2 Z" fill="#7c5128" />

          {/* head */}
          <g className="builder__head">
            <path d="M54,54 L66,54 L66,64 L54,64 Z" fill="#e0a870" />
            <ellipse cx="60" cy="40" rx="21" ry="19" fill="url(#bd-skin)" />
            {/* ears */}
            <circle cx="39" cy="42" r="4.6" fill="#e8b47e" />
            <circle cx="81" cy="42" r="4.6" fill="#e8b47e" />
            {/* eyes */}
            <g className="builder__eyes">
              <ellipse cx="52" cy="38" rx="5.4" ry="6" fill="#fff" />
              <ellipse cx="68" cy="38" rx="5.4" ry="6" fill="#fff" />
              <circle className="builder__pupil" cx="53" cy="39" r="2.8" fill="#2a1c10" />
              <circle className="builder__pupil" cx="69" cy="39" r="2.8" fill="#2a1c10" />
              <g className="builder__lids">
                <path d="M46,45 q6,-9 12,0 l0,-16 l-12,0 Z" fill="url(#bd-skin)" />
                <path d="M62,45 q6,-9 12,0 l0,-16 l-12,0 Z" fill="url(#bd-skin)" />
              </g>
            </g>
            {/* brows */}
            <g className="builder__brows">
              <path d="M46,29 q6,-3 12,-1" stroke="#4a2d15" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M62,28 q6,-2 12,1" stroke="#4a2d15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
            {/* nose */}
            <path d="M60,40 q6,5 -1,9 q-5,1 -5,-3 Z" fill="#e8b47e" />
            {/* moustache and beard */}
            <path d="M44,50 q16,10 32,0 q-4,16 -16,16 q-12,0 -16,-16 Z" fill="#c9a06a" />
            <path d="M48,49 q12,7 24,0 q-3,6 -12,6 q-9,0 -12,-6 Z" fill="#b98d55" />
            {/* hat */}
            <g className="builder__hat">
              <path d="M60,6 q16,2 18,16 q1,6 -3,8 l-30,0 q-4,-2 -3,-8 q2,-14 18,-16 Z" fill="url(#bd-hat)" />
              <ellipse cx="60" cy="30" rx="34" ry="9" fill="url(#bd-hat)" />
              <ellipse cx="60" cy="28" rx="34" ry="8" fill="#a06f38" />
              <rect x="42" y="24" width="36" height="6" rx="3" fill="#4a2d15" />
              <ellipse cx="52" cy="16" rx="7" ry="4" fill="#fff" opacity="0.18" />
            </g>
          </g>
        </g>

        {/* front arm with the hammer */}
        <g className="builder__arm builder__arm--front">
          <path d="M76,74 L92,92" stroke="#4ea337" strokeWidth="12" strokeLinecap="round" />
          <circle cx="94" cy="94" r="7.5" fill="url(#bd-skin)" />
          <g className="builder__hammer">
            <path d="M94,94 L110,66" stroke="#8a5a33" strokeWidth="7" strokeLinecap="round" />
            <path d="M100,58 L120,66 L116,78 L96,70 Z" fill="url(#bd-steel)" stroke="#4b5468" strokeWidth="2.4" />
            <path d="M101,60 L116,66 L114,71 L99,65 Z" fill="#fff" opacity="0.35" />
          </g>
        </g>
      </g>

      {/* hammer lying on the ground */}
      <g className="builder__dropped">
        <path d="M84,156 L104,150" stroke="#8a5a33" strokeWidth="6" strokeLinecap="round" />
        <path d="M104,144 L118,150 L115,158 L101,152 Z" fill="url(#bd-steel)" stroke="#4b5468" strokeWidth="2" />
      </g>

      {/* impact sparks while hammering */}
      <g className="builder__sparks">
        <path d="M112,80 l7,-5 M114,86 l9,0 M110,92 l7,5" stroke="#ffe07a" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* mug */}
      <g className="builder__mug">
        <rect x="74" y="44" width="15" height="16" rx="3" fill="#d8d2c4" stroke="#8d8578" strokeWidth="2" />
        <path d="M89,48 q7,4 0,9" fill="none" stroke="#8d8578" strokeWidth="3" />
        <rect x="76" y="46" width="11" height="4" rx="2" fill="#a9713c" />
      </g>

      {/* sleep */}
      <g className="builder__zzz">
        <text className="zzz zzz--0" x="86" y="24" fontSize="16" fontWeight="800" fill="#ffffff">z</text>
        <text className="zzz zzz--1" x="96" y="14" fontSize="20" fontWeight="800" fill="#ffffff">z</text>
        <text className="zzz zzz--2" x="108" y="4" fontSize="24" fontWeight="800" fill="#ffffff">z</text>
      </g>

      {/* anger */}
      <g className="builder__steam">
        <path className="steam steam--0" d="M34,18 q-6,-8 0,-14" stroke="#ff8a6a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path className="steam steam--1" d="M88,16 q6,-8 0,-14" stroke="#ff8a6a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}
