import type { ResourceKind, UpgradeDef, UpgradeId, UpgradeLevelDef } from '@/types'

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

/**
 * Advertised build times always end in 23h 59m, because of course they do.
 * The real timer is measured in seconds so the joke is still playable.
 */
const advertised = (fullDays: number) => fullDays * DAY + 23 * HOUR + 59 * MINUTE

type LevelTuple = [
  title: string,
  effect: string,
  cost: number,
  advertisedDays: number,
  realSeconds: number,
  gemCost: number,
]

function levels(costKind: Exclude<ResourceKind, 'gems'>, tuples: LevelTuple[]): UpgradeLevelDef[] {
  return tuples.map(([title, effect, cost, advertisedDays, realSeconds, gemCost], i) => ({
    level: i + 2, // everything starts the village at level 1
    title,
    effect,
    cost,
    costKind,
    fakeDurationMs: advertised(advertisedDays),
    realDurationMs: realSeconds * 1000,
    gemCost,
  }))
}

/**
 * Storage levels 2..10. Production is multiplied by the level, so a maxed
 * storage pours ten times what it started with; the bill climbs to match.
 */
function storageLevels(costKind: Exclude<ResourceKind, 'gems'>, what: string): UpgradeLevelDef[] {
  const costs = [
    900_000, 2_200_000, 4_000_000, 7_000_000, 11_000_000, 16_000_000, 23_000_000, 32_000_000,
    45_000_000,
  ]
  return levels(
    costKind,
    costs.map((cost, i): LevelTuple => {
      const level = i + 2
      return [
        `${what} Storage Lv${level}`,
        `${what} production ×${level}.`,
        cost,
        Math.min(13, level - 1),
        20 + i * 4,
        164 + i * 208,
      ]
    }),
  )
}

export const UPGRADES: UpgradeDef[] = [
  {
    // Gold is stored with elixir money, and vice versa. Obviously.
    id: 'gold-storage',
    name: 'Gold Storage',
    buildingId: 'gold-storage',
    icon: 'coin',
    levels: storageLevels('elixir', 'Gold'),
  },
  {
    id: 'elixir-storage',
    name: 'Elixir Storage',
    buildingId: 'elixir-storage',
    icon: 'droplet',
    levels: storageLevels('gold', 'Elixir'),
  },
  {
    id: 'weather-station',
    name: 'Weather Station',
    // Bought from the slot it will occupy, not from the drawer.
    hidden: true,
    icon: 'cloud',
    levels: levels('gold', [
      [
        'Weather Station',
        'Shows the real weather where you are, and brings it to the village.',
        10_000_000,
        13,
        40,
        1_827,
      ],
    ]),
  },
  {
    id: 'search-bar',
    name: 'Search Bar',
    buildingId: 'search-hall',
    icon: 'search',
    levels: levels('elixir', [
      ['Reinforced Search Bar', 'The bar is now 4 pixels wider.', 750_000, 2, 24, 219],
      ['Gilded Search Bar', 'Adds a trim nobody asked for.', 2_400_000, 5, 36, 640],
      ['Legendary Search Bar', 'Still sends you to the same search engine.', 5_800_000, 11, 52, 1_502],
    ]),
  },
  {
    id: 'clock',
    name: 'Clock',
    buildingId: 'clock-tower',
    icon: 'clock',
    levels: levels('gold', [
      ['Framed Clock', 'The clock gets a decorative frame.', 480_000, 1, 20, 118],
      ['Precision Clock', 'Seconds appear. Time now feels faster.', 1_600_000, 4, 32, 512],
      ['Legendary Clock', 'Glows. Unnecessarily.', 4_900_000, 13, 55, 1_827],
    ]),
  },
  {
    id: 'bookmark-hut',
    name: 'Bookmark Hut',
    buildingId: 'bookmark-hut',
    icon: 'book',
    levels: levels('gold', [
      ['Bookmark Hut Lv2', 'Holds more bookmarks you will never open.', 620_000, 2, 26, 248],
      ['Bookmark Hut Lv3', 'Now with a second shelf. Same four links.', 2_100_000, 6, 40, 712],
    ]),
  },
  {
    id: 'coffee-machine',
    name: 'Coffee Machine',
    icon: 'coffee',
    levels: levels('elixir', [
      ['Coffee Machine Lv2', 'Brews 8% louder.', 400_000, 1, 18, 96],
      ['Coffee Machine Lv3', 'Adds a second button. It does the same thing.', 1_350_000, 4, 30, 458],
      ['Coffee Machine Lv4', 'Descaling reminder, permanently.', 3_900_000, 9, 48, 1_244],
    ]),
  },
  {
    id: 'wifi-tower',
    name: 'Wi-Fi Tower',
    icon: 'wifi',
    levels: levels('gold', [
      ['Wi-Fi Tower Lv2', 'One extra bar. Purely decorative.', 900_000, 3, 28, 342],
      ['Wi-Fi Tower Lv3', 'Range extended into the hallway.', 3_100_000, 8, 44, 1_106],
    ]),
  },
  {
    id: 'productivity',
    name: 'Productivity',
    buildingId: 'laboratory',
    icon: 'chart',
    levels: levels('elixir', [
      ['Productivity Lv2', 'Effect: none measurable.', 1_100_000, 5, 34, 604],
      ['Productivity Lv3', 'Effect: still none, but with a chart.', 4_200_000, 14, 58, 1_968],
    ]),
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    icon: 'moon',
    levels: levels('elixir', [
      ['Dark Mode Lv2', 'It was already dark. Now it is committed.', 1_750_000, 6, 38, 806],
    ]),
  },
  {
    id: 'builders-chair',
    name: "Builder's Chair",
    buildingId: 'builder-hut',
    icon: 'chair',
    levels: levels('gold', [
      ['Cushioned Chair', 'The Builder will not use it.', 350_000, 2, 22, 204],
      ['Ergonomic Chair', 'The Builder still will not use it.', 1_900_000, 7, 42, 918],
    ]),
  },
  {
    id: 'desktop',
    name: 'Desktop',
    icon: 'desktop',
    levels: levels('gold', [
      ['Desktop Lv2', 'Rearranges 41 files into one folder called "new".', 2_600_000, 9, 46, 1_318],
    ]),
  },
  {
    id: 'wall-north',
    name: 'Wall',
    icon: 'wall',
    levels: levels('gold', [
      ['Wall Lv2', 'Almost nothing.', 8_000_000, 13, 24, 1_827],
      ['Wall Lv3', 'Marginally less than almost nothing.', 8_000_000, 13, 26, 1_827],
      ['Wall Lv4', 'The wall is now slightly more of a wall.', 8_000_000, 13, 28, 1_827],
    ]),
  },
  {
    id: 'wall-south',
    name: 'Wall',
    icon: 'wall',
    levels: levels('gold', [
      ['Wall Lv2', 'Identical to the other wall.', 8_000_000, 13, 24, 1_827],
      ['Wall Lv3', 'Identical to the other wall, but later.', 8_000_000, 13, 27, 1_827],
    ]),
  },
  {
    id: 'another-wall',
    name: 'Another Wall',
    icon: 'wall',
    levels: levels('gold', [
      ['Another Wall Lv2', 'You know what this does.', 8_000_000, 13, 25, 1_827],
      ['Another Wall Lv3', 'Cost unchanged. Effect unchanged. Wall unchanged.', 8_000_000, 13, 29, 1_827],
      ['Another Wall Lv4', 'At this point it is a lifestyle.', 8_000_000, 13, 31, 1_827],
    ]),
  },
]

export const UPGRADE_BY_ID: Record<UpgradeId, UpgradeDef> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
) as Record<UpgradeId, UpgradeDef>

export function nextLevelOf(id: UpgradeId, currentLevel: number): UpgradeLevelDef | null {
  return UPGRADE_BY_ID[id].levels.find((l) => l.level === currentLevel + 1) ?? null
}

export function maxLevelOf(id: UpgradeId): number {
  const list = UPGRADE_BY_ID[id].levels
  return list.length ? list[list.length - 1]!.level : 1
}
