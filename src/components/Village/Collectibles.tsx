import type { Drop } from '@/types'
import { ElixirIcon, GemIcon, GoldIcon } from '@/components/Common/Icons'
import type { StorageCollector } from '@/hooks/useEconomy'
import { formatCompact } from '@/utils/format'
import './Collectibles.scss'

interface CollectiblesProps {
  collectors: StorageCollector[]
  onCollect: (kind: StorageCollector['kind']) => void
  drops: Drop[]
  onGrab: (id: number) => void
}

/** Storage bubbles and loose drops — everything on the island you can click for loot. */
export function Collectibles({ collectors, onCollect, drops, onGrab }: CollectiblesProps) {
  return (
    <>
      {collectors.map((c) => (
        <button
          key={c.kind}
          type="button"
          className={`loot loot--${c.kind}`}
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
          onClick={() => onCollect(c.kind)}
          aria-label={`Collect ${formatCompact(c.amount)} ${c.kind}`}
        >
          <span className="loot__icon">{c.kind === 'gold' ? <GoldIcon /> : <ElixirIcon />}</span>
          <span className="loot__amount">{formatCompact(c.amount)}</span>
          <span className="loot__meter">
            <span className="loot__meter-fill" style={{ transform: `scaleX(${c.ratio})` }} />
          </span>
        </button>
      ))}

      {drops.map((drop) => (
        <button
          key={drop.id}
          type="button"
          className={`drop drop--${drop.kind}`}
          style={{ left: `${drop.x}%`, top: `${drop.y}%` }}
          onClick={() => onGrab(drop.id)}
          aria-label={`Pick up ${formatCompact(drop.amount)} ${drop.kind}`}
        >
          <span className="drop__glint" />
          {drop.kind === 'gold' ? <GoldIcon /> : drop.kind === 'elixir' ? <ElixirIcon /> : <GemIcon />}
          <span className="drop__tag">{formatCompact(drop.amount)}</span>
        </button>
      ))}
    </>
  )
}
