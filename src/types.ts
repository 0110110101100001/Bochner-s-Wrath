/** Domain types shared by the game logic, the storage layer and the UI. */

export type ResourceKind = 'gold' | 'elixir' | 'gems'

export type Resources = Record<ResourceKind, number>

export type BuildingId =
  | 'search-hall'
  | 'bookmark-hut'
  | 'clock-tower'
  | 'builder-hut'
  | 'gold-storage'
  | 'elixir-storage'
  | 'laboratory'

/** Anything the Builder is willing to pretend to work on. */
export type UpgradeId =
  | 'search-bar'
  | 'clock'
  | 'bookmark-hut'
  | 'coffee-machine'
  | 'wifi-tower'
  | 'productivity'
  | 'dark-mode'
  | 'builders-chair'
  | 'desktop'
  | 'wall-north'
  | 'wall-south'
  | 'another-wall'
  | 'gold-storage'
  | 'elixir-storage'
  | 'weather-station'

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'

export interface Settings {
  animations: boolean
  sounds: boolean
  showResourceBar: boolean
  clock24h: boolean
  randomEvents: boolean
  /** Run the war replay screensaver when the tab is left alone. */
  screensaver: boolean
  /** Idle time before it starts, in seconds. */
  screensaverDelay: number
}

export interface Shortcut {
  id: string
  label: string
  url: string
}

/** A build in progress. Two clocks: the honest one and the advertised one. */
export interface ActiveUpgrade {
  upgradeId: UpgradeId
  /** The level being built (i.e. current level + 1). */
  level: number
  startedAt: number
  /** When the bar actually fills. Seconds, not days. */
  endsAt: number
  /** The number the village is told. Days, obviously. */
  fakeDurationMs: number
  gemCost: number
}

export interface VillageState {
  version: number
  resources: Resources
  settings: Settings
  shortcuts: Shortcut[]
  /** upgradeId -> completed level. Missing means level 1. */
  levels: Partial<Record<UpgradeId, number>>
  activeUpgrades: ActiveUpgrade[]
  /** The click-to-upgrade easter egg wall. Goes places. */
  wallLevel: number
  /** When each storage was last emptied, for offline production. */
  collectors: { goldAt: number; elixirAt: number }
  tabOpens: number
  /** Epoch ms of recent new-tab opens, trimmed to the last hour. */
  recentOpens: number[]
  onboardingCompleted: boolean
}

/* ------------------------------------------------------------- static data */

export interface BuildingDef {
  id: BuildingId
  name: string
  /** Shown under the name on hover. */
  blurb: string
  /** Anchor point on the 1200x700 village stage, in percent. */
  x: number
  y: number
  scale: number
  /** Opens this upgrade when the building is clicked. */
  upgradeId?: UpgradeId
}

export interface UpgradeLevelDef {
  /** Level you end up with. */
  level: number
  title: string
  effect: string
  cost: number
  costKind: Exclude<ResourceKind, 'gems'>
  /** Advertised build time in milliseconds. Absurd on purpose. */
  fakeDurationMs: number
  /** What it actually takes, in milliseconds. Merciful on purpose. */
  realDurationMs: number
  gemCost: number
}

export interface UpgradeDef {
  id: UpgradeId
  name: string
  /** Kept out of the upgrade drawer; bought from its own slot in the HUD. */
  hidden?: boolean
  /** Which village building lights up while this is being built. */
  buildingId?: BuildingId
  icon: UpgradeIcon
  levels: UpgradeLevelDef[]
}

export type UpgradeIcon =
  | 'cloud'
  | 'coin'
  | 'droplet'
  | 'search'
  | 'clock'
  | 'book'
  | 'coffee'
  | 'wifi'
  | 'chart'
  | 'moon'
  | 'chair'
  | 'desktop'
  | 'wall'

/* ---------------------------------------------------------------- runtime */

/** The villagers doing the defending. */
export type TroopKind = 'brute' | 'slinger' | 'boulder'

/** The objects from partial differential equations doing the attacking. */
export type AttackerKind =
  | 'laplacian'
  | 'bochner'
  | 'sobolev'
  | 'dirac'
  | 'navier'
  | 'heat'
  | 'gradient'

export interface Troop {
  id: number
  side: 'attack' | 'defend'
  kind: TroopKind | AttackerKind
  /** Stage-percent position the unit is currently moving to. */
  x: number
  y: number
  travelMs: number
  facing: 1 | -1
  state: 'marching' | 'attacking' | 'cheering' | 'beaten'
  /** Index into ATTACKER_STAGES: how far this operator has been degraded. */
  stage: number
}

export interface WarState {
  phase: 'off' | 'intro' | 'battle' | 'result'
  troops: Troop[]
  wrecked: BuildingId[]
  /** 0..100 */
  destruction: number
  stars: number
  /** Epoch ms the current replay started, for the countdown readout. */
  startedAt: number
  /** How long the fighting part of this replay lasts, in ms. */
  battleMs: number
  attacker: string
  clan: string
  /** Building currently being struck by lightning, if any. */
  bolt: BuildingId | null
  /** The estimate each building is currently hiding behind. */
  shields: Partial<Record<BuildingId, string>>
  /** Buildings whose estimate actually held. */
  held: BuildingId[]
}

export type BuilderMood =
  | 'walking'
  | 'hammering'
  | 'idle'
  | 'sleeping'
  | 'drinking'
  | 'staring'
  | 'angry'
  | 'dropped-hammer'
  | 'leaving'
  | 'away'
  | 'disappointed'

export interface Toast {
  id: number
  title: string
  body?: string
  tone: 'info' | 'gold' | 'danger' | 'gem'
  ttl: number
}

/** A loose coin, droplet or gem waiting to be clicked. */
export interface Drop {
  id: number
  kind: ResourceKind
  amount: number
  x: number
  y: number
  /** Index into DROP_SPOTS, so two drops never land on the same tuft. */
  spot: number
}

export interface FloatingValue {
  id: number
  amount: number
  kind: ResourceKind
  /** Percent coordinates on the village stage. */
  x: number
  y: number
}
