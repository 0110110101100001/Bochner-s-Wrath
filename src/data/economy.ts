import type { ResourceKind } from '@/types'

/**
 * The village economy. Tuned "easy" on purpose: a couple of collections should
 * pay for a real upgrade, so the numbers on the resource bar actually move.
 */

export const PRODUCTION = {
  /** Per hour, at storage level 1. Multiplied by the storage's level. */
  goldPerHour: 240_000,
  elixirPerHour: 240_000,
  /** Storages stop filling after this, so nothing accrues forever. */
  capHours: 3,
  /** Below this, the collector bubble stays hidden. */
  minToShow: 250,
} as const

/** How much a storage is holding right now. */
export function pendingAmount(
  kind: Exclude<ResourceKind, 'gems'>,
  storageLevel: number,
  since: number,
  now: number,
): number {
  const perHour = kind === 'gold' ? PRODUCTION.goldPerHour : PRODUCTION.elixirPerHour
  const hours = Math.min(PRODUCTION.capHours, Math.max(0, now - since) / 3_600_000)
  return Math.floor(perHour * storageLevel * hours)
}

/** Fraction of the cap that is full, for the bubble's little meter. */
export function fillRatio(since: number, now: number): number {
  const hours = Math.max(0, now - since) / 3_600_000
  return Math.min(1, hours / PRODUCTION.capHours)
}

/** No village needs more signposts than this. */
export const MAX_SHORTCUTS = 10

/** What the fifth signpost costs. Every one after it doubles. */
export const SHORTCUT_BASE_COST = 1_000_000

/**
 * Raising a signpost, given how many already stand. The four the village
 * starts with are free of charge; the fifth costs a million, and each one
 * after that doubles, so the tenth is 32M and you think about it first.
 */
export function shortcutBuildCost(existing: number): number {
  return SHORTCUT_BASE_COST * 2 ** Math.max(0, Math.min(MAX_SHORTCUTS - 1, existing) - 4)
}

/** Repainting a signpost you raised yourself. Only charged when something changes. */
export const SHORTCUT_EDIT_COST = 500_000

/** Taking one down. Priced so nobody demolishes a signpost by accident. */
export const SHORTCUT_DEMOLISH_COST = 1_000_000

/**
 * The signposts the village came with cost more to touch than the ones you
 * put up. Keyed by shortcut id; anything not listed pays the standard rate.
 */
const FOUNDING_EDIT_COST: Record<string, number> = {
  ph: 50_000_000,
  mp: 10_000_000,
  dl: 10_000_000,
  ws: 10_000_000,
}

const FOUNDING_DEMOLISH_COST: Record<string, number> = {
  mp: 10_000_000,
  dl: 10_000_000,
  ws: 10_000_000,
}

/**
 * The one signpost the Builder will not take down at any price. It is not in
 * FOUNDING_DEMOLISH_COST either, so there is no number to pay.
 */
export const PERMANENT_SHORTCUT_IDS: ReadonlySet<string> = new Set(['ph'])

/** What repainting one particular signpost costs. */
export function shortcutEditCost(id: string): number {
  return FOUNDING_EDIT_COST[id] ?? SHORTCUT_EDIT_COST
}

/** What taking one particular signpost down costs. */
export function shortcutDemolishCost(id: string): number {
  return FOUNDING_DEMOLISH_COST[id] ?? SHORTCUT_DEMOLISH_COST
}

/** One-off price of the Weather Station, bought straight from its own slot. */
export const WEATHER_STATION_COST = 10_000_000

/**
 * The haul scattered across the island every time a new tab opens. It is not
 * credited automatically — you have to click it, which is the whole point.
 */
export const ARRIVAL_DROPS = {
  gold: { count: 1, min: 150_000, max: 260_000 },
  elixir: { count: 2, min: 80_000, max: 200_000 },
  /** Gems are rare on purpose; the Finish Now joke only works if they stay low. */
  gems: { chance: 0.34, min: 1, max: 3 },
  /** Arrival loot waits around much longer than a stray coin. */
  lifetimeMs: 75_000,
} as const

/** Loose coins and droplets that keep landing while you watch. */
export const DROPS = {
  firstDelayMs: 3_500,
  minGapMs: 5_000,
  maxGapMs: 12_000,
  /** How long a drop waits to be clicked before it sinks into the grass. */
  lifetimeMs: 22_000,
  min: 8_000,
  max: 44_000,
  /** Never more than this on screen at once. */
  maxOnScreen: 6,
} as const

/** Spots on the island a loose drop can land on, in stage percent. */
export const DROP_SPOTS: { x: number; y: number }[] = [
  { x: 30, y: 58 },
  { x: 44, y: 66 },
  { x: 57, y: 62 },
  { x: 70, y: 58 },
  { x: 38, y: 46 },
  { x: 62, y: 44 },
  { x: 48, y: 79 },
  { x: 24, y: 70 },
  { x: 76, y: 71 },
  { x: 60, y: 86 },
  { x: 36, y: 84 },
  { x: 68, y: 83 },
  { x: 18, y: 52 },
  { x: 84, y: 52 },
  { x: 50, y: 36 },
  { x: 42, y: 55 },
  { x: 64, y: 70 },
  { x: 28, y: 44 },
  { x: 74, y: 46 },
  { x: 52, y: 71 },
]
