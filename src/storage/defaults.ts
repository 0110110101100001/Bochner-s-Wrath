import type { Settings, Shortcut, VillageState } from '@/types'

export const STORAGE_KEY = 'buildersTab/state'
export const STATE_VERSION = 3

export const DEFAULT_SETTINGS: Settings = {
  animations: true,
  sounds: false, // audio is opt-in
  showResourceBar: true,
  clock24h: true,
  randomEvents: true,
  screensaver: true,
  screensaverDelay: 10,
}

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: 'ph', label: 'FindMyHusband', url: 'https://www.pornhub.com' },
  { id: 'mp', label: 'MílaTV', url: 'https://www.karlin.mff.cuni.cz/~pokorny/index.php?a=teach2' },
  { id: 'dl', label: 'WoodHome', url: 'https://tesarstvi-ludvik.cz/' },
  { id: 'ws', label: 'Fotogalerka', url: 'https://artecon.cz/praha/kontakty/kontakty-na-pedagogy/' },
]

/**
 * A believable starting treasury: two storages that look impressive and a gem
 * count that has clearly been spent on something regrettable.
 */
export function createDefaultState(): VillageState {
  const jitter = (base: number, spread: number) =>
    base + Math.floor(Math.random() * spread) * 10

  return {
    version: STATE_VERSION,
    resources: {
      gold: jitter(4_600_000, 40_000),
      elixir: jitter(6_100_000, 40_000),
      gems: 17,
    },
    settings: { ...DEFAULT_SETTINGS },
    shortcuts: DEFAULT_SHORTCUTS.map((s) => ({ ...s })),
    levels: {},
    activeUpgrades: [],
    wallLevel: 1,
    // A fresh village starts empty rather than with a full offline haul.
    collectors: { goldAt: Date.now(), elixirAt: Date.now() },
    tabOpens: 0,
    recentOpens: [],
    onboardingCompleted: false,
  }
}
