import { useEffect, useRef } from 'react'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
]

/** Fires when the arrow sequence is typed anywhere outside a text field. */
export function useKonami(onTrigger: () => void): void {
  const progress = useRef(0)
  const handler = useRef(onTrigger)
  handler.current = onTrigger

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.isContentEditable)) return

      if (event.key === SEQUENCE[progress.current]) {
        progress.current += 1
        if (progress.current === SEQUENCE.length) {
          progress.current = 0
          handler.current()
        }
      } else {
        progress.current = event.key === SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
