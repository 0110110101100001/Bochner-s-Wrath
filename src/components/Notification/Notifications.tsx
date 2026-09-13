import { AnimatePresence, motion } from 'framer-motion'
import type { Toast } from '@/types'
import { SNAP } from '@/animations/springs'
import './Notifications.scss'

export function Notifications({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            className={`toast toast--${toast.tone}`}
            onClick={() => onDismiss(toast.id)}
            layout
            initial={{ opacity: 0, x: -40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.92, transition: { duration: 0.18 } }}
            transition={SNAP}
          >
            <span className="toast__flag" aria-hidden="true" />
            <span className="toast__text">
              <span className="toast__title">{toast.title}</span>
              {toast.body && <span className="toast__body">{toast.body}</span>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
