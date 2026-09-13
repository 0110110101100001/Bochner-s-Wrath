import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { FloatingValue, Toast } from '@/types'

interface StageValue {
  toasts: Toast[]
  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
  floats: FloatingValue[]
  spawnFloat: (value: Omit<FloatingValue, 'id'>) => void
  shake: (strength?: 'small' | 'big') => void
  shaking: '' | 'small' | 'big'
  devMode: boolean
  toggleDevMode: (on: boolean) => void
}

const StageContext = createContext<StageValue | null>(null)

let nextId = 1

/** Transient, never-persisted stage effects: toasts, floaters, screen shake. */
export function StageProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [floats, setFloats] = useState<FloatingValue[]>([])
  const [shaking, setShaking] = useState<'' | 'small' | 'big'>('')
  const [devMode, setDevMode] = useState(false)
  const timers = useRef<number[]>([])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = nextId++
      setToasts((list) => [...list.slice(-3), { ...toast, id }])
      later(() => dismissToast(id), toast.ttl)
    },
    [dismissToast, later],
  )

  const spawnFloat = useCallback(
    (value: Omit<FloatingValue, 'id'>) => {
      const id = nextId++
      setFloats((list) => [...list.slice(-6), { ...value, id }])
      later(() => setFloats((list) => list.filter((f) => f.id !== id)), 1700)
    },
    [later],
  )

  const shake = useCallback(
    (strength: 'small' | 'big' = 'small') => {
      setShaking(strength)
      later(() => setShaking(''), strength === 'big' ? 720 : 380)
    },
    [later],
  )

  const toggleDevMode = useCallback((on: boolean) => setDevMode(on), [])

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      dismissToast,
      floats,
      spawnFloat,
      shake,
      shaking,
      devMode,
      toggleDevMode,
    }),
    [toasts, pushToast, dismissToast, floats, spawnFloat, shake, shaking, devMode, toggleDevMode],
  )

  return <StageContext.Provider value={value}>{children}</StageContext.Provider>
}

export function useStage(): StageValue {
  const ctx = useContext(StageContext)
  if (!ctx) throw new Error('useStage must be used inside <StageProvider>')
  return ctx
}
