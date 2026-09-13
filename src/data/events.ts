/** Random things that happen when a new tab opens. */

export type EventKind = 'overlay' | 'toast' | 'attack' | 'sale'

export interface VillageEventDef {
  id: string
  kind: EventKind
  weight: number
  title: string
  body?: string
  /** How long the event stays on screen, in ms. */
  duration: number
  tone?: 'info' | 'gold' | 'danger' | 'gem'
}

export const RANDOM_EVENTS: VillageEventDef[] = [
  {
    id: 'maintenance',
    kind: 'overlay',
    weight: 3,
    title: 'Maintenance Break',
    body: 'Just kidding. Your browser still works.',
    duration: 2200,
  },
  {
    id: 'builders-busy',
    kind: 'toast',
    weight: 4,
    title: 'All builders are busy.',
    body: 'There is one builder. He is sitting down.',
    duration: 4200,
    tone: 'info',
  },
  {
    id: 'wall-sale',
    kind: 'sale',
    weight: 3,
    title: 'Wall discount!',
    body: 'Limited time. Very limited value.',
    duration: 5200,
    tone: 'gold',
  },
  {
    id: 'attack',
    kind: 'attack',
    weight: 3,
    title: 'Your village was attacked!',
    body: 'Damage: 0%',
    duration: 4200,
    tone: 'danger',
  },
  {
    id: 'shield',
    kind: 'toast',
    weight: 2,
    title: 'Village Shield active',
    body: 'Duration: until you close this tab.',
    duration: 4000,
    tone: 'gem',
  },
  {
    id: 'clan-games',
    kind: 'toast',
    weight: 2,
    title: 'Clan Games have started',
    body: 'Nobody in your clan will participate.',
    duration: 4200,
    tone: 'info',
  },
  {
    id: 'gem-box',
    kind: 'toast',
    weight: 2,
    title: 'A gem box appeared',
    body: 'It is behind the Elixir Storage. It is not clickable.',
    duration: 4200,
    tone: 'gem',
  },
]

/** Fires instead of a random event when the tab is being opened compulsively. */
export const PERSONAL_BREAK = {
  id: 'personal-break',
  kind: 'overlay' as const,
  title: 'Personal Break',
  body: 'Chief, maybe stop opening new tabs.',
  duration: 2600,
}

/** More than this many opens inside PERSONAL_BREAK_WINDOW triggers the joke. */
export const PERSONAL_BREAK_THRESHOLD = 7
export const PERSONAL_BREAK_WINDOW = 5 * 60_000

export const DEV_MODE_LABELS = [
  'Builder.position = probably_wrong',
  'GoldStorage.balance = NaN',
  'Village.production = works_on_my_machine',
  'ClockTower.time = Invalid Date',
  'Wall.hp = undefined',
  'Elixir.viscosity = TODO',
  'SearchHall.index = [object Object]',
  'Laboratory.result = null',
  'village.render() // 1 warning',
]

export const DEV_MODE_TITLE = 'Developer Mode'
export const DEV_MODE_TAGLINE = 'Works on my village.'
