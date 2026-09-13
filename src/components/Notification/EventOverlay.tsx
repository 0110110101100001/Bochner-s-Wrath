import { AnimatePresence, motion } from 'framer-motion'
import type { OverlayEvent } from '@/hooks/useArrivalEvents'
import { EXIT, FADE, LAND } from '@/animations/springs'
import { GearIcon } from '@/components/Common/Icons'

/** Full-screen interruptions: Maintenance Break and friends. */
export function EventOverlay({ event }: { event: OverlayEvent | null }) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="event-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: EXIT }}
          transition={FADE}
        >
          <motion.div
            className="event-overlay__card"
            initial={{ scale: 0.82, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: -10, transition: EXIT }}
            transition={LAND}
          >
            <div className="event-overlay__gears" aria-hidden="true">
              <GearIcon />
              <GearIcon />
            </div>
            <h2 className="event-overlay__title">{event.title}</h2>
            {event.body && (
              <motion.p
                className="event-overlay__body"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                {event.body}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
