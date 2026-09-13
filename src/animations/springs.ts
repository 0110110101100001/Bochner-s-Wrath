import type { Transition } from 'framer-motion'

/**
 * Shared motion curves. Everything in this UI should feel like a chunky game
 * panel being thrown around, not like a web page fading.
 */

/** Panels and dialogs snapping into place. */
export const SNAP: Transition = { type: 'spring', stiffness: 380, damping: 26 }

/** Larger surfaces: the upgrade drawer. Heavier, slightly slower. */
export const DRAWER: Transition = { type: 'spring', stiffness: 260, damping: 30 }

/** Overlay cards that land and settle. */
export const LAND: Transition = { type: 'spring', stiffness: 300, damping: 22 }

/** Plain crossfades for scrims. */
export const FADE: Transition = { duration: 0.2 }

/**
 * Every `exit` must use this, never a spring.
 *
 * AnimatePresence only unmounts once each child's exit animation reports
 * completion, and an interrupted spring can settle without ever reporting it.
 * The node then lingers at opacity 0 — and an invisible full-screen scrim or
 * drawer swallows every click on the page.
 */
export const EXIT: Transition = { duration: 0.18 }
