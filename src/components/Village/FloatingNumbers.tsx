import type { FloatingValue } from '@/types'
import './FloatingNumbers.scss'

const LABEL: Record<FloatingValue['kind'], string> = {
  gold: 'Gold',
  elixir: 'Elixir',
  gems: 'Gems',
}

/** The little "+37 Gold" that drifts up off a building and evaporates. */
export function FloatingNumbers({ values }: { values: FloatingValue[] }) {
  return (
    <>
      {values.map((v) => (
        <span
          key={v.id}
          className={`floater floater--${v.kind}`}
          style={{ left: `${v.x}%`, top: `${v.y}%` }}
          aria-hidden="true"
        >
          {v.amount > 0 ? `+${v.amount} ${LABEL[v.kind]}` : 'Complete'}
        </span>
      ))}
    </>
  )
}
