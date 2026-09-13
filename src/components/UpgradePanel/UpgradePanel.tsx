import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { UpgradeDef, UpgradeId } from '@/types'
import { DRAWER, EXIT } from '@/animations/springs'
import { CloseIcon, ElixirIcon, GemIcon, GoldIcon, UpgradeGlyph } from '@/components/Common/Icons'
import { CLOSE_UPGRADE_PROMPTS } from '@/data/jokes'
import { nextLevelOf, UPGRADES } from '@/data/upgrades'
import { useTick } from '@/hooks/useNow'
import { useUpgradeActions } from '@/hooks/useUpgrades'
import { useVillageStore } from '@/hooks/useVillageStore'
import { advertisedRemaining, clamp01, formatAmount, formatDuration } from '@/utils/format'
import './UpgradePanel.scss'

interface UpgradePanelProps {
  open: boolean
  onClose: () => void
  /** Scrolls to and highlights this row when the panel opens. */
  focusId: UpgradeId | null
}

export function UpgradePanel({ open, onClose, focusId }: UpgradePanelProps) {
  const { state } = useVillageStore()
  const upgrades = useUpgradeActions()
  const listRef = useRef<HTMLDivElement>(null)

  // Only ticks while the drawer is open and something is actually building.
  useTick(open && state.activeUpgrades.length > 0 ? 400 : null)

  // Escape should get you out of the drawer, like every other panel here.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open || !focusId) return
    const node = listRef.current?.querySelector<HTMLElement>(`[data-upgrade="${focusId}"]`)
    node?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [open, focusId])

  return (
    <div className={`drawer-host ${open ? 'is-open' : ''}`}>
      <AnimatePresence>
        {open && (
          <motion.aside
            className="upgrade-panel panel"
            initial={{ x: '112%', opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '112%', opacity: 0.4, transition: EXIT }}
            transition={DRAWER}
            aria-label="Upgrades"
          >
            <header className="upgrade-panel__head">
              <div>
                <h2 className="panel__title">Upgrades</h2>
                <p className="upgrade-panel__sub">
                  {state.activeUpgrades.length > 0
                    ? `${state.activeUpgrades.length} in progress. Builder: 1.`
                    : 'The Builder is available. Technically.'}
                </p>
              </div>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close upgrades">
                <CloseIcon />
              </button>
            </header>

            <div className="upgrade-panel__list scroll-area" ref={listRef}>
              {UPGRADES.filter((def) => !def.hidden).map((def) => (
                <UpgradeRow
                  key={def.id}
                  def={def}
                  level={upgrades.levelOf(def.id)}
                  highlighted={def.id === focusId}
                  upgrades={upgrades}
                />
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}

interface RowProps {
  def: UpgradeDef
  level: number
  highlighted: boolean
  upgrades: ReturnType<typeof useUpgradeActions>
}

function UpgradeRow({ def, level, highlighted, upgrades }: RowProps) {
  const active = upgrades.activeFor(def.id)
  const next = nextLevelOf(def.id, level)
  const [cancelStep, setCancelStep] = useState(0)

  // The confirmation resets once the user stops arguing with it.
  useEffect(() => {
    if (cancelStep === 0) return
    const id = window.setTimeout(() => setCancelStep(0), 4000)
    return () => window.clearTimeout(id)
  }, [cancelStep])

  const onCancel = useCallback(() => {
    if (cancelStep < CLOSE_UPGRADE_PROMPTS.length) {
      setCancelStep((s) => s + 1)
      return
    }
    setCancelStep(0)
    upgrades.cancel(def.id)
  }, [cancelStep, def.id, upgrades])

  const progress = active
    ? clamp01((Date.now() - active.startedAt) / Math.max(1, active.endsAt - active.startedAt))
    : 0

  return (
    <div
      className={`upg ${active ? 'is-building' : ''} ${highlighted ? 'is-highlighted' : ''}`}
      data-upgrade={def.id}
    >
      <span className="upg__glyph">
        <UpgradeGlyph name={def.icon} />
        <span className="upg__lv">{level}</span>
      </span>

      <div className="upg__main">
        <div className="upg__title">
          <span className="upg__name">{def.name}</span>
          {!active && next && <span className="upg__to">Lv {level} &rarr; {next.level}</span>}
        </div>

        {active ? (
          <>
            <div className="upg__bar">
              <span className="upg__bar-fill" style={{ transform: `scaleX(${progress})` }} />
              <span className="upg__bar-shine" />
            </div>
            <div className="upg__timeline">
              <span className="upg__remaining">{advertisedRemaining(active.fakeDurationMs, progress)}</span>
              <span className="upg__eta">remaining</span>
            </div>
            <div className="upg__actions">
              <button
                type="button"
                className="btn btn--gem btn--small upg__finish"
                onClick={() => upgrades.finishNow(def.id)}
              >
                <GemIcon />
                Finish Now &ndash; {active.gemCost.toLocaleString('en-US')} Gems
              </button>
              <button type="button" className="btn btn--stone btn--small" onClick={onCancel}>
                {cancelStep === 0 ? 'Cancel' : CLOSE_UPGRADE_PROMPTS[cancelStep - 1]}
              </button>
            </div>
          </>
        ) : next ? (
          <>
            <p className="upg__effect">{next.effect}</p>
            <div className="upg__actions">
              <span className="upg__cost">
                {next.costKind === 'gold' ? <GoldIcon /> : <ElixirIcon />}
                {formatAmount(next.cost)}
              </span>
              <span className="upg__time">{formatDuration(next.fakeDurationMs)}</span>
              <button type="button" className="btn btn--small" onClick={() => upgrades.start(def.id)}>
                Upgrade
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="upg__effect">Maximum level. There is nothing left to ruin.</p>
            <div className="upg__actions">
              <span className="upg__max">Max</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
