import { useEffect, useState } from 'react'

/** Tracks document visibility so expensive animations can be parked. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => !document.hidden)

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}
