import { SCENERY } from '@/data/buildings'
import './Scenery.scss'

/** Non-interactive set dressing: trees, bushes and rocks with a gentle sway. */
export function Scenery() {
  return (
    <>
      {SCENERY.map((item, i) => (
        <div
          key={item.id}
          className={`scenery scenery--${item.kind}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${(item.kind === 'tree' ? 9 : item.kind === 'pine' ? 7.5 : item.kind === 'bush' ? 5.5 : 5) * item.scale}%`,
            zIndex: Math.round(item.y * 10) - 1,
            animationDelay: `${-i * 0.73}s`,
          }}
          aria-hidden="true"
        >
          {item.kind === 'tree' && <Tree />}
          {item.kind === 'pine' && <Pine />}
          {item.kind === 'bush' && <Bush />}
          {item.kind === 'rock' && <Rock />}
        </div>
      ))}
    </>
  )
}

function Tree() {
  return (
    <svg viewBox="0 0 120 160">
      <ellipse className="scenery__shadow" cx="60" cy="150" rx="34" ry="8" />
      <path d="M56,150 L56,104 Q60,96 64,104 L64,150 Z" fill="#7a5128" />
      <path d="M60,120 L44,106" stroke="#7a5128" strokeWidth="6" strokeLinecap="round" />
      <g className="scenery__crown">
        <ellipse cx="60" cy="66" rx="46" ry="40" fill="#3f8c2c" />
        <ellipse cx="44" cy="56" rx="30" ry="26" fill="#5cb03c" />
        <ellipse cx="74" cy="50" rx="26" ry="23" fill="#6ec247" />
        <ellipse cx="52" cy="40" rx="18" ry="15" fill="#8fd85f" opacity="0.9" />
        <circle cx="82" cy="76" r="5" fill="#e8484a" />
        <circle cx="38" cy="82" r="4" fill="#e8484a" />
      </g>
    </svg>
  )
}

function Pine() {
  return (
    <svg viewBox="0 0 100 170">
      <ellipse className="scenery__shadow" cx="50" cy="160" rx="28" ry="7" />
      <path d="M46,160 L46,120 L54,120 L54,160 Z" fill="#6b4423" />
      <g className="scenery__crown">
        <path d="M50,10 L84,72 L16,72 Z" fill="#2f7a3f" />
        <path d="M50,44 L90,104 L10,104 Z" fill="#39914a" />
        <path d="M50,78 L96,134 L4,134 Z" fill="#43a455" />
        <path d="M50,10 L84,72 L60,72 L50,34 Z" fill="#000" opacity="0.12" />
      </g>
    </svg>
  )
}

function Bush() {
  return (
    <svg viewBox="0 0 100 70">
      <ellipse className="scenery__shadow" cx="50" cy="64" rx="30" ry="6" />
      <g className="scenery__crown">
        <ellipse cx="34" cy="44" rx="24" ry="19" fill="#3f8c2c" />
        <ellipse cx="66" cy="46" rx="22" ry="17" fill="#4a9e33" />
        <ellipse cx="50" cy="34" rx="24" ry="20" fill="#5cb03c" />
        <ellipse cx="42" cy="28" rx="12" ry="9" fill="#8fd85f" opacity="0.8" />
        <circle cx="66" cy="34" r="3.4" fill="#ffd94f" />
        <circle cx="30" cy="38" r="3" fill="#ff8fb6" />
      </g>
    </svg>
  )
}

function Rock() {
  return (
    <svg viewBox="0 0 100 70">
      <ellipse className="scenery__shadow" cx="50" cy="62" rx="32" ry="7" />
      <path d="M14,60 L28,28 L52,18 L78,32 L88,60 Z" fill="#9aa3b4" />
      <path d="M52,18 L78,32 L88,60 L62,60 Z" fill="#6e7889" />
      <path d="M28,28 L52,18 L48,36 L30,40 Z" fill="#c0c8d6" />
      <path d="M22,60 q10,-8 20,-2" stroke="#6e7889" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
