import { AnimatePresence, motion } from 'framer-motion'
import type { WarState } from '@/types'
import { EXIT, FADE, LAND } from '@/animations/springs'
import { DEFENCE_SUBTITLES, WAR_CLOCK_MS, WAR_RESULT_SUBTITLES } from '@/data/war'
import { useTick } from '@/hooks/useNow'
import { clamp01 } from '@/utils/format'
import './War.scss'

/** The attack readout: stars, destruction and a timer that is in a hurry. */
export function WarHud({ war }: { war: WarState }) {
  useTick(war.phase === 'battle' ? 250 : null)

  const elapsed = clamp01((Date.now() - war.startedAt) / war.battleMs)
  const left = Math.max(0, Math.round((WAR_CLOCK_MS * (1 - elapsed)) / 1000))
  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`

  // Stable per replay so the subtitle does not flicker on re-render.
  const held = war.destruction === 0
  const pool = held ? DEFENCE_SUBTITLES : WAR_RESULT_SUBTITLES
  const subtitle = pool[war.startedAt % pool.length]

  return (
    <div className="war" aria-hidden="true">
      <div className="war__vignette" />

      <motion.div
        className="war__bar"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -70, opacity: 0 }}
        transition={LAND}
      >
        <div className="war__tag">
          <span className="war__label">PDE Raid</span>
          <span className="war__attacker">
            {war.attacker} <i>of</i> {war.clan}
          </span>
        </div>

        <Stars count={war.stars} />

        <div className="war__meters">
          <div className="war__pct">
            <b>{war.destruction}</b>
            <span>%</span>
          </div>
          <div className="war__bar-track">
            <span className="war__bar-fill" style={{ transform: `scaleX(${war.destruction / 100})` }} />
          </div>
          <div className="war__clock">{clock}</div>
        </div>
      </motion.div>

      <AnimatePresence>
        {war.phase === 'result' && (
          <motion.div
            className="war__result"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // A tween on exit: an interrupted spring can leave the node behind.
            exit={{ opacity: 0, scale: 0.92, y: -8, transition: EXIT }}
            transition={LAND}
          >
            <Stars count={war.stars} big />
            <h2 className="war__result-title">
              {held ? 'Attack repelled' : `${war.destruction}% regularity lost`}
            </h2>
            <p className="war__result-sub">{subtitle}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="war__hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={FADE}
      >
        Move the mouse to return to your village.
      </motion.p>
    </div>
  )
}

function Stars({ count, big = false }: { count: number; big?: boolean }) {
  return (
    <div className={`war__stars ${big ? 'is-big' : ''}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`war__star ${i < count ? 'is-earned' : ''}`}>
          <svg viewBox="0 0 48 46">
            <path
              d="M24,2 L30.4,17.2 L46.8,18.6 L34.4,29.4 L38.1,45.4 L24,36.8 L9.9,45.4 L13.6,29.4 L1.2,18.6 L17.6,17.2 Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>
      ))}
    </div>
  )
}
