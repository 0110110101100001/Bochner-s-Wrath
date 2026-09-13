import type { BuildingDef, BuildingId } from '@/types'

/**
 * Village layout. Coordinates are percentages of the 1200x700 stage and the
 * anchor is the *base* of the building, so things further down the stage are
 * closer to the camera and are drawn on top.
 *
 * The plateau in Island.tsx is an ellipse centred on (50%, 55%) with radii of
 * roughly 42% and 32%. Anything placed here has to sit inside it:
 *   ((x - 50) / 42)^2 + ((y - 55) / 32)^2 < 1
 */
export const BUILDINGS: BuildingDef[] = [
  {
    id: 'clock-tower',
    name: 'Clock Tower',
    blurb: 'Knows exactly how long you have been procrastinating.',
    x: 26,
    y: 52,
    scale: 1,
    upgradeId: 'clock',
  },
  {
    id: 'search-hall',
    name: 'Search Hall',
    blurb: 'Where every question eventually goes.',
    x: 50,
    y: 48,
    scale: 1.16,
    upgradeId: 'search-bar',
  },
  {
    id: 'bookmark-hut',
    name: 'Bookmark Hut',
    blurb: '2 417 bookmarks. You have opened four of them.',
    x: 74,
    y: 51,
    scale: 0.95,
    upgradeId: 'bookmark-hut',
  },
  {
    id: 'gold-storage',
    name: 'Gold Storage',
    blurb: 'Full. As always. Right before you need one more.',
    x: 20,
    y: 65,
    scale: 0.94,
    upgradeId: 'gold-storage',
  },
  {
    id: 'elixir-storage',
    name: 'Elixir Storage',
    blurb: 'Do not drink the elixir.',
    x: 80,
    y: 66,
    scale: 0.94,
    upgradeId: 'elixir-storage',
  },
  {
    id: 'builder-hut',
    name: "Builder's Hut",
    blurb: 'Occupied. Permanently.',
    x: 34,
    y: 75,
    scale: 0.88,
    upgradeId: 'builders-chair',
  },
  {
    id: 'laboratory',
    name: 'Laboratory of Questionable Productivity',
    blurb: 'Researching: why this tab was opened.',
    x: 66,
    y: 76,
    scale: 0.9,
    upgradeId: 'productivity',
  },
]

export const BUILDING_BY_ID: Record<BuildingId, BuildingDef> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b]),
) as Record<BuildingId, BuildingDef>

/** Decorative wall pieces. Exactly one of them is the one worth clicking. */
export const WALLS: { id: string; x: number; y: number; scale: number; interactive: boolean }[] = [
  { id: 'wall-w', x: 13, y: 54, scale: 0.8, interactive: false },
  { id: 'wall-e', x: 87, y: 55, scale: 0.8, interactive: false },
  { id: 'wall-sw', x: 27, y: 82, scale: 0.86, interactive: false },
  { id: 'wall-se', x: 72, y: 82, scale: 0.95, interactive: true },
]

/** Trees, bushes and rocks. `kind` selects the artwork in Scenery.tsx. */
export const SCENERY: { id: string; kind: 'tree' | 'pine' | 'bush' | 'rock'; x: number; y: number; scale: number }[] =
  [
    { id: 's1', kind: 'tree', x: 23, y: 40, scale: 0.9 },
    { id: 's2', kind: 'pine', x: 78, y: 41, scale: 0.86 },
    { id: 's3', kind: 'tree', x: 14, y: 62, scale: 1 },
    { id: 's4', kind: 'pine', x: 88, y: 63, scale: 0.94 },
    { id: 's5', kind: 'bush', x: 44, y: 84, scale: 1 },
    { id: 's6', kind: 'bush', x: 57, y: 85, scale: 0.86 },
    { id: 's7', kind: 'rock', x: 31, y: 63, scale: 0.9 },
    { id: 's8', kind: 'rock', x: 69, y: 64, scale: 0.75 },
    { id: 's9', kind: 'bush', x: 36, y: 37, scale: 0.7 },
    { id: 's10', kind: 'tree', x: 61, y: 36, scale: 0.62 },
  ]

/** Spots the Builder is willing to stand around in, in stage percent. */
export const BUILDER_WAYPOINTS: { x: number; y: number }[] = [
  { x: 44, y: 78 },
  { x: 52, y: 83 },
  { x: 60, y: 79 },
  { x: 38, y: 70 },
  { x: 64, y: 71 },
  { x: 50, y: 64 },
]

/** Where floating resource numbers pop out of, in stage percent. */
export const FLOAT_SOURCES: { x: number; y: number }[] = [
  { x: 20, y: 56 },
  { x: 80, y: 57 },
  { x: 50, y: 34 },
  { x: 26, y: 36 },
  { x: 74, y: 38 },
]
