import { useCallback, useRef, useState } from 'react'
import { GEM_TAUNTS } from '@/data/jokes'
import { useSfx } from '@/hooks/useSfx'
import { useStage } from '@/hooks/useStage'
import { useVillageStore } from '@/hooks/useVillageStore'
import { formatAmount } from '@/utils/format'
import { AnimatedNumber } from '@/components/Common/AnimatedNumber'
import { ElixirIcon, GemIcon, GoldIcon } from '@/components/Common/Icons'
import './ResourceBar.scss'

export function ResourceBar() {
  const { state } = useVillageStore()
  const { pushToast } = useStage()
  const sfx = useSfx()
  const gemClicks = useRef(0)
  const [gemShake, setGemShake] = useState(false)
  const shakeTimer = useRef(0)

  const { gold, elixir, gems } = state.resources

  const pokeGems = useCallback(() => {
    gemClicks.current += 1
    setGemShake(true)
    window.clearTimeout(shakeTimer.current)
    shakeTimer.current = window.setTimeout(() => setGemShake(false), 340)
    sfx('sparkle')

    const taunt = GEM_TAUNTS.find((t) => t.at === gemClicks.current)
    if (taunt) {
      pushToast({ title: taunt.text, tone: 'gem', ttl: 3400 })
    }
  }, [pushToast, sfx])

  return (
    <div className="resource-bar">
      <div className="res res--gold">
        <span className="res__icon">
          <GoldIcon />
        </span>
        <span className="res__meter">
          <span className="res__fill" style={{ transform: 'scaleX(0.93)' }} />
          <span className="res__value">
            <AnimatedNumber value={gold} format={formatAmount} />
          </span>
        </span>
      </div>

      <div className="res res--elixir">
        <span className="res__icon">
          <ElixirIcon />
        </span>
        <span className="res__meter">
          <span className="res__fill" style={{ transform: 'scaleX(0.87)' }} />
          <span className="res__value">
            <AnimatedNumber value={elixir} format={formatAmount} />
          </span>
        </span>
      </div>

      <button
        type="button"
        className={`res res--gems ${gemShake ? 'is-poked' : ''}`}
        onClick={pokeGems}
        title="Gems"
      >
        <span className="res__icon">
          <GemIcon />
        </span>
        <span className="res__meter res__meter--gems">
          <span className="res__value">
            <AnimatedNumber value={gems} format={formatAmount} />
          </span>
        </span>
      </button>
    </div>
  )
}
