import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type { ActiveUpgrade, Resources, Settings, Shortcut, UpgradeId, VillageState } from '@/types'
import { createDefaultState } from '@/storage/defaults'
import { clearState, loadState, reconcile, saveState } from '@/storage/villageStorage'
import { PERSONAL_BREAK_WINDOW } from '@/data/events'

type Action =
  | { type: 'hydrate'; state: VillageState }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'resources'; delta: Partial<Resources> }
  | { type: 'shortcuts'; shortcuts: Shortcut[] }
  | { type: 'upgrade/start'; upgrade: ActiveUpgrade; cost: number; costKind: 'gold' | 'elixir' }
  | { type: 'upgrade/cancel'; id: UpgradeId }
  | { type: 'upgrade/complete'; id: UpgradeId }
  | { type: 'collect'; kind: 'gold' | 'elixir'; amount: number; now: number }
  | { type: 'purchase'; id: UpgradeId; level: number; cost: number; costKind: 'gold' | 'elixir' }
  | { type: 'wall/bump' }
  | { type: 'tab/open'; now: number }
  | { type: 'onboarding/done' }
  | { type: 'replace'; state: VillageState }

function reducer(state: VillageState, action: Action): VillageState {
  switch (action.type) {
    case 'hydrate':
    case 'replace':
      return action.state

    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.patch } }

    case 'resources': {
      const next = { ...state.resources }
      for (const [key, value] of Object.entries(action.delta)) {
        const kind = key as keyof Resources
        next[kind] = Math.max(0, next[kind] + (value ?? 0))
      }
      return { ...state, resources: next }
    }

    case 'shortcuts':
      return { ...state, shortcuts: action.shortcuts }

    case 'upgrade/start': {
      if (state.activeUpgrades.some((u) => u.upgradeId === action.upgrade.upgradeId)) return state
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.costKind]: Math.max(0, state.resources[action.costKind] - action.cost),
        },
        activeUpgrades: [...state.activeUpgrades, action.upgrade],
      }
    }

    case 'upgrade/cancel':
      return {
        ...state,
        activeUpgrades: state.activeUpgrades.filter((u) => u.upgradeId !== action.id),
      }

    case 'upgrade/complete': {
      const finished = state.activeUpgrades.find((u) => u.upgradeId === action.id)
      if (!finished) return state
      return {
        ...state,
        levels: { ...state.levels, [action.id]: finished.level },
        activeUpgrades: state.activeUpgrades.filter((u) => u.upgradeId !== action.id),
      }
    }

    case 'purchase': {
      if (state.resources[action.costKind] < action.cost) return state
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.costKind]: state.resources[action.costKind] - action.cost,
        },
        levels: { ...state.levels, [action.id]: action.level },
      }
    }

    case 'collect': {
      const key = action.kind === 'gold' ? 'goldAt' : 'elixirAt'
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.kind]: state.resources[action.kind] + Math.max(0, action.amount),
        },
        collectors: { ...state.collectors, [key]: action.now },
      }
    }

    case 'wall/bump': {
      // The wall snaps to its final, entirely reasonable level near the end.
      const next = state.wallLevel >= 45 ? 999 : state.wallLevel >= 999 ? 999 : state.wallLevel + 1
      return { ...state, wallLevel: next }
    }

    case 'tab/open': {
      const recent = [...state.recentOpens, action.now].filter(
        (t) => action.now - t < PERSONAL_BREAK_WINDOW,
      )
      return { ...state, tabOpens: state.tabOpens + 1, recentOpens: recent.slice(-40) }
    }

    case 'onboarding/done':
      return { ...state, onboardingCompleted: true }

    default:
      return state
  }
}

export interface VillageActions {
  updateSettings: (patch: Partial<Settings>) => void
  addResources: (delta: Partial<Resources>) => void
  setShortcuts: (shortcuts: Shortcut[]) => void
  startUpgrade: (upgrade: ActiveUpgrade, cost: number, costKind: 'gold' | 'elixir') => void
  cancelUpgrade: (id: UpgradeId) => void
  completeUpgrade: (id: UpgradeId) => void
  collectStorage: (kind: 'gold' | 'elixir', amount: number, now: number) => void
  purchase: (id: UpgradeId, level: number, cost: number, costKind: 'gold' | 'elixir') => void
  bumpWall: () => void
  finishOnboarding: () => void
  resetVillage: () => void
  importState: (raw: unknown) => void
  exportState: () => string
}

interface StoreValue {
  state: VillageState
  ready: boolean
  actions: VillageActions
}

const StoreContext = createContext<StoreValue | null>(null)

export function VillageStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, createDefaultState)
  const readyRef = useRef(false)
  const [, forceReady] = useReducer((n: number) => n + 1, 0)
  const openCounted = useRef(false)

  useEffect(() => {
    let cancelled = false
    void loadState().then((loaded) => {
      if (cancelled) return
      dispatch({ type: 'hydrate', state: loaded })
      readyRef.current = true
      forceReady()
      if (!openCounted.current) {
        openCounted.current = true
        dispatch({ type: 'tab/open', now: Date.now() })
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Persist on a short debounce; the new tab is often closed within seconds.
  useEffect(() => {
    if (!readyRef.current) return
    const handle = window.setTimeout(() => void saveState(state), 180)
    return () => window.clearTimeout(handle)
  }, [state])

  const actions = useMemo<VillageActions>(
    () => ({
      updateSettings: (patch) => dispatch({ type: 'settings', patch }),
      addResources: (delta) => dispatch({ type: 'resources', delta }),
      setShortcuts: (shortcuts) => dispatch({ type: 'shortcuts', shortcuts }),
      startUpgrade: (upgrade, cost, costKind) =>
        dispatch({ type: 'upgrade/start', upgrade, cost, costKind }),
      cancelUpgrade: (id) => dispatch({ type: 'upgrade/cancel', id }),
      completeUpgrade: (id) => dispatch({ type: 'upgrade/complete', id }),
      collectStorage: (kind, amount, now) => dispatch({ type: 'collect', kind, amount, now }),
      purchase: (id, level, cost, costKind) =>
        dispatch({ type: 'purchase', id, level, cost, costKind }),
      bumpWall: () => dispatch({ type: 'wall/bump' }),
      finishOnboarding: () => dispatch({ type: 'onboarding/done' }),
      resetVillage: () => {
        void clearState()
        dispatch({ type: 'replace', state: createDefaultState() })
      },
      importState: (raw) => dispatch({ type: 'replace', state: reconcile(raw) }),
      exportState: () => '',
    }),
    [],
  )

  // exportState needs the live state, so it is patched in outside the memo.
  const stateRef = useRef(state)
  stateRef.current = state
  const exportState = useCallback(() => JSON.stringify(stateRef.current, null, 2), [])

  const value = useMemo<StoreValue>(
    () => ({ state, ready: readyRef.current, actions: { ...actions, exportState } }),
    [state, actions, exportState],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useVillageStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useVillageStore must be used inside <VillageStoreProvider>')
  return ctx
}
