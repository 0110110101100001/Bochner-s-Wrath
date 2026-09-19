import type { ActiveUpgrade, Shortcut, UpgradeId, VillageState } from '@/types'
import { UPGRADE_BY_ID, maxLevelOf } from '@/data/upgrades'
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

const DAY_MS = 86_400_000

/**
 * Ceiling on any single resource. Far above anything reachable by playing,
 * but finite, so a hand-edited save cannot hand out Infinity.
 */
const MAX_RESOURCE = 1e12

/** A finite, non-negative whole number, or the fallback. */
function count(value: unknown, fallback: number, max = MAX_RESOURCE): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(0, Math.floor(value)))
}

/** An epoch stamp, which cannot sit in the future. */
function stamp(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(Date.now(), Math.max(0, Math.floor(value)))
}

/** Drops unknown upgrade ids and caps every level at what the game allows. */
function cleanLevels(raw: unknown): Partial<Record<UpgradeId, number>> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Partial<Record<UpgradeId, number>> = {}
  for (const [id, level] of Object.entries(raw as Record<string, unknown>)) {
    if (!Object.hasOwn(UPGRADE_BY_ID, id)) continue
    const key = id as UpgradeId
    const value = count(level, 0, maxLevelOf(key))
    if (value > 0) out[key] = value
  }
  return out
}

function cleanShortcuts(raw: unknown, fallback: Shortcut[]): Shortcut[] {
  if (!Array.isArray(raw)) return fallback
  const out = raw.flatMap((entry): Shortcut[] => {
    if (!entry || typeof entry !== 'object') return []
    const { id, label, url } = entry as Record<string, unknown>
    if (typeof id !== 'string' || typeof label !== 'string' || typeof url !== 'string') return []
    if (!id || !url) return []
    return [{ id, label, url }]
  })
  return out.slice(0, 10)
}

/** One build per upgrade, all clocks finite, nothing scheduled past a day out. */
function cleanActiveUpgrades(raw: unknown): ActiveUpgrade[] {
  if (!Array.isArray(raw)) return []
  const now = Date.now()
  const seen = new Set<string>()
  return raw.flatMap((entry): ActiveUpgrade[] => {
    if (!entry || typeof entry !== 'object') return []
    const u = entry as Record<string, unknown>
    const id = u.upgradeId
    if (typeof id !== 'string' || !Object.hasOwn(UPGRADE_BY_ID, id) || seen.has(id)) return []
    seen.add(id)
    const upgradeId = id as UpgradeId
    return [
      {
        upgradeId,
        level: count(u.level, 1, maxLevelOf(upgradeId)),
        startedAt: stamp(u.startedAt, now),
        endsAt: count(u.endsAt, now, now + DAY_MS),
        fakeDurationMs: count(u.fakeDurationMs, 0),
        gemCost: count(u.gemCost, 0),
      },
    ]
  })
}

/**
 * Fills in anything a newer version added, so old saves keep working — and
 * rejects anything a hand-edited save tries to smuggle in. Every number that
 * reaches the store passes through here, so this is the one place where a
 * tampered `chrome.storage` entry gets cut back down to something playable.
 */
export function reconcile(partial: unknown): VillageState {
  const base = createDefaultState()
  if (!partial || typeof partial !== 'object') return base
  const saved = partial as Partial<VillageState>
  const savedVersion = count(saved.version, 0)

  const settings = { ...DEFAULT_SETTINGS, ...saved.settings }
  // v2 shortened the screensaver delay. Older saves carry the previous default
  // as if it were a deliberate choice, so it is reset rather than kept.
  if (savedVersion < 2) settings.screensaverDelay = DEFAULT_SETTINGS.screensaverDelay
  settings.screensaverDelay = count(settings.screensaverDelay, DEFAULT_SETTINGS.screensaverDelay, 3600)

  return {
    version: STATE_VERSION,
    resources: {
      gold: count(saved.resources?.gold, base.resources.gold),
      elixir: count(saved.resources?.elixir, base.resources.elixir),
      gems: count(saved.resources?.gems, base.resources.gems),
    },
    settings,
    shortcuts: cleanShortcuts(saved.shortcuts, base.shortcuts),
    levels: cleanLevels(saved.levels),
    activeUpgrades: cleanActiveUpgrades(saved.activeUpgrades),
    wallLevel: count(saved.wallLevel, 1),
    collectors: {
      goldAt: stamp(saved.collectors?.goldAt, base.collectors.goldAt),
      elixirAt: stamp(saved.collectors?.elixirAt, base.collectors.elixirAt),
    },
    tabOpens: count(saved.tabOpens, 0),
    recentOpens: Array.isArray(saved.recentOpens)
      ? saved.recentOpens.filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
      : [],
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
