import type { AttackerKind, TroopKind, WarState } from '@/types'
import { BUILDING_BY_ID } from '@/data/buildings'
import { ATTACKER_STAGES } from '@/data/war'
import { AttackerArt } from './AttackerArt'
import { TroopArt } from './TroopArt'
import './War.scss'

/** Attackers, defenders and spell effects. Rendered inside the village stage. */
export function WarLayer({ war }: { war: WarState }) {
  if (war.phase === 'off') return null

  return (
    <>
      {war.troops.map((unit) => (
        <div
          key={unit.id}
          className="unit-anchor"
          style={{
            transform: `translate(${unit.x}%, ${unit.y}%)`,
            transitionDuration: `${unit.travelMs}ms`,
            // Attackers ride above every building so their nameplate stays
            // readable; villagers keep sorting naturally with the scenery.
            zIndex:
              unit.side === 'attack' ? 900 + Math.round(unit.y) : Math.round(unit.y * 10) + 2,
          }}
        >
          {unit.side === 'attack' ? (
            <div className={`attacker attacker--${unit.kind}`} data-state={unit.state}>
              <span className="attacker__art">
                <AttackerArt kind={unit.kind as AttackerKind} />
              </span>
              <span className="attacker__label" key={unit.stage}>
                {ATTACKER_STAGES[unit.kind as AttackerKind][unit.stage] ??
                  ATTACKER_STAGES[unit.kind as AttackerKind][0]}
              </span>
            </div>
          ) : (
            <div className={`troop troop--${unit.kind}`} data-state={unit.state}>
              <span className="troop__flip" style={{ transform: `scaleX(${unit.facing})` }}>
                <TroopArt kind={unit.kind as TroopKind} />
              </span>
            </div>
          )}
        </div>
      ))}

      {war.bolt && <Bolt targetId={war.bolt} />}
    </>
  )
}

function Bolt({ targetId }: { targetId: WarState['bolt'] }) {
  if (!targetId) return null
  const target = BUILDING_BY_ID[targetId]

  return (
    <div
      className="war-bolt"
      style={{ left: `${target.x}%`, top: `${target.y}%`, zIndex: Math.round(target.y * 10) + 5 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 60 240" preserveAspectRatio="none">
        <path
          d="M34,0 L14,112 L30,112 L8,240 L48,104 L30,104 L46,0 Z"
          fill="#bfefff"
          stroke="#7fd4ff"
          strokeWidth="3"
        />
      </svg>
      <span className="war-bolt__flash" />
    </div>
  )
}
