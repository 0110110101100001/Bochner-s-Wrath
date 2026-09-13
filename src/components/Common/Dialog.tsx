import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { EXIT, FADE, SNAP } from '@/animations/springs'
import { CloseIcon } from './Icons'
import './Dialog.scss'

interface DialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: number
}

export function Dialog({ open, title, onClose, children, footer, width = 460 }: DialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /**
   * Portalled out of the HUD, where it would inherit `pointer-events: none`
   * and be trapped in the HUD's stacking context — clicks aimed at the form
   * fell straight through to the village behind it.
   *
   * The target must stay inside the React root: React 18 delegates events from
   * the root container, so a portal into <body> renders fine but never fires a
   * single onClick.
   */
  return createPortal(
    <div className={`dialog-host ${open ? 'is-open' : ''}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="dialog-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: EXIT }}
            transition={FADE}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose()
            }}
          >
            <motion.div
              className="dialog panel"
              style={{ width }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ opacity: 0, scale: 0.88, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 14, transition: EXIT }}
              transition={SNAP}
            >
              <header className="dialog__head">
                <h2 className="panel__title">{title}</h2>
                <button type="button" className="icon-btn icon-btn--small" onClick={onClose} aria-label="Close">
                  <CloseIcon />
                </button>
              </header>
              <div className="dialog__body scroll-area">{children}</div>
              {footer && <footer className="dialog__foot">{footer}</footer>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.getElementById('root') ?? document.body,
  )
}
