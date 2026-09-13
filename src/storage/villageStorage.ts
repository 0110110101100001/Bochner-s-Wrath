import type { VillageState } from '@/types'
import { createDefaultState, DEFAULT_SETTINGS, STATE_VERSION, STORAGE_KEY } from './defaults'

/**
 * Thin typed wrapper over chrome.storage.local.
 *
 * Falls back to localStorage so `npm run dev` works in a plain browser tab,
 * where the chrome.* namespace does not exist.
 */

type Area = Pick<chrome.storage.StorageArea, 'get' | 'set' | 'remove'>

function getArea(): Area | null {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) return chrome.storage.local
  return null
}

const localFallback: Area = {
  async get(key) {
    const raw = window.localStorage.getItem(String(key))
    return raw ? { [String(key)]: JSON.parse(raw) } : {}
  },
  async set(items) {
    for (const [k, v] of Object.entries(items)) {
      window.localStorage.setItem(k, JSON.stringify(v))
    }
  },
  async remove(key) {
    window.localStorage.removeItem(String(key))
  },
}

const area = (): Area => getArea() ?? localFallback

/** Fills in anything a newer version added, so old saves keep working. */
export function reconcile(partial: unknown): VillageState {
  const base = createDefaultState()
  if (!partial || typeof partial !== 'object') return base
  const saved = partial as Partial<VillageState>
  const savedVersion = typeof saved.version === 'number' ? saved.version : 0

  const settings = { ...DEFAULT_SETTINGS, ...saved.settings }
  // v2 shortened the screensaver delay. Older saves carry the previous default
  // as if it were a deliberate choice, so it is reset rather than kept.
  if (savedVersion < 2) settings.screensaverDelay = DEFAULT_SETTINGS.screensaverDelay

  return {
    version: STATE_VERSION,
    resources: { ...base.resources, ...saved.resources },
    settings,
    shortcuts: Array.isArray(saved.shortcuts) ? saved.shortcuts : base.shortcuts,
    levels: saved.levels ?? {},
    activeUpgrades: Array.isArray(saved.activeUpgrades) ? saved.activeUpgrades : [],
    wallLevel: typeof saved.wallLevel === 'number' ? saved.wallLevel : 1,
    collectors: {
      goldAt: saved.collectors?.goldAt ?? base.collectors.goldAt,
      elixirAt: saved.collectors?.elixirAt ?? base.collectors.elixirAt,
    },
    tabOpens: typeof saved.tabOpens === 'number' ? saved.tabOpens : 0,
    recentOpens: Array.isArray(saved.recentOpens) ? saved.recentOpens : [],
    onboardingCompleted: saved.onboardingCompleted === true,
  }
}

export async function loadState(): Promise<VillageState> {
  try {
    const bag = await area().get(STORAGE_KEY)
    return reconcile((bag as Record<string, unknown>)[STORAGE_KEY])
  } catch {
    return createDefaultState()
  }
}

export async function saveState(state: VillageState): Promise<void> {
  try {
    await area().set({ [STORAGE_KEY]: state })
  } catch {
    // A full quota or a revoked permission must never break the new tab.
  }
}

export async function clearState(): Promise<void> {
  try {
    await area().remove(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
