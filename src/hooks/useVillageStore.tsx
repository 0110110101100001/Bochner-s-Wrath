import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type { ActiveUpgrade, Resources, Settings, Shortcut, UpgradeId, VillageState } from '@/types'
import { createDefaultState, STORAGE_KEY } from '@/storage/defaults'
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
        if (!Object.hasOwn(next, key)) continue
        const kind = key as keyof Resources
        // A non-finite delta would poison the balance for good: NaN survives
        // Math.max, and every `balance < cost` check then reads as affordable.
        if (typeof value !== 'number' || !Number.isFinite(value)) continue
        next[kind] = Math.max(0, next[kind] + value)
      }
      return { ...state, resources: next }
    }

    case 'shortcuts':
      return { ...state, shortcuts: action.shortcuts }

    case 'upgrade/start': {
      if (state.activeUpgrades.some((u) => u.upgradeId === action.upgrade.upgradeId)) return state
      // The UI checks this too, but the reducer is the last gate: without it a
      // negative cost reads as a payout, and a short balance silently clamps
      // to zero instead of failing the purchase.
      if (!Number.isFinite(action.cost) || action.cost < 0) return state
      if (state.resources[action.costKind] < action.cost) return state
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.costKind]: state.resources[action.costKind] - action.cost,
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
  const lastWrite = useRef('')
  useEffect(() => {
    if (!readyRef.current) return
    const handle = window.setTimeout(() => {
      lastWrite.current = JSON.stringify(state)
      void saveState(state)
    }, 180)
    return () => window.clearTimeout(handle)
  }, [state])

  /**
   * Adopt what another new tab saved. Every tab holds the whole village in
   * memory and writes all of it back, so without this the last tab to touch
   * anything silently undoes the others: collect loot in one, click the wall
   * in another, loot gone.
   */
  const liveState = useRef(state)
  liveState.current = state
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) return
    const onChanged = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== 'local' || !readyRef.current) return
      const change = changes[STORAGE_KEY]
      if (!change) return
      const raw = JSON.stringify(change.newValue)
      // Our own debounced write echoes back through here, and so does a write
      // from a tab that already agreed with us. Neither is news.
      if (raw === lastWrite.current || raw === JSON.stringify(liveState.current)) return
      dispatch({ type: 'replace', state: reconcile(change.newValue) })
    }
    chrome.storage.onChanged.addListener(onChanged)
    return () => chrome.storage.onChanged.removeListener(onChanged)
  }, [])

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
    }),
    [],
  )


  const value = useMemo<StoreValue>(
    () => ({ state, ready: readyRef.current, actions }),
    [state, actions],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useVillageStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useVillageStore must be used inside <VillageStoreProvider>')
  return ctx
}
