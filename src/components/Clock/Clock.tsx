import { useNow } from '@/hooks/useNow'
import { useVillageStore } from '@/hooks/useVillageStore'
import { formatClock, formatDateLabel } from '@/utils/time'
import './Clock.scss'

/**
 * The clock's looks are the reward for the Clock upgrade:
 * 1 plain, 2 framed, 3 with seconds, 4 unnecessarily legendary.
 */
export function Clock() {
  const { state } = useVillageStore()
  const level = state.levels.clock ?? 1
  const showSeconds = level >= 3
  const now = useNow(showSeconds ? 1000 : 15_000)
  const { time, suffix, seconds } = formatClock(now, state.settings.clock24h)

  return (
    <div className={`clock clock--lv${Math.min(level, 4)}`}>
      {level >= 2 && (
        <>
          <span className="clock__corner clock__corner--tl" />
          <span className="clock__corner clock__corner--tr" />
          <span className="clock__corner clock__corner--bl" />
          <span className="clock__corner clock__corner--br" />
        </>
      )}

      <div className="clock__time">
        <span className="clock__hm">{time}</span>
        {showSeconds && <span className="clock__sec">{seconds}</span>}
        {suffix && <span className="clock__suffix">{suffix}</span>}
      </div>
      <div className="clock__date">{formatDateLabel(now)}</div>
    </div>
  )
}
