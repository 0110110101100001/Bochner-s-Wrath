/**
 * Everything the Builder says. Add lines freely — each array is picked from at
 * random, so nothing else needs to change.
 */

export const IDLE_LINES = [
  'Still upgrading.',
  'You again?',
  'I only have two hands.',
  'Another wall?',
  '14 days remaining.',
  'Please stop clicking me.',
  'Chief, this could have been an email.',
  'No, gems are not free.',
  "I haven't slept since Town Hall 9.",
  'Your other builder is conveniently unavailable.',
  'The wall is fine. The wall has always been fine.',
  'I measured twice. I am not cutting.',
  'That storage is full. It has been full since Tuesday.',
  'One day I will finish something.',
  'This hut has no door, Chief. I have never asked why.',
] as const

export const NIGHT_LINES = [
  'The village sleeps. I do not.',
  'It is dark. I am still holding a hammer.',
  'Overtime again, Chief?',
  'Nothing productive happens after midnight.',
] as const

export const LATE_NIGHT_LINE = 'Chief... why are you still awake?'

export const MORNING_LINES = [
  'Morning, Chief.',
  'Coffee first. Walls second.',
  'The sun is up. Regrettably, so am I.',
] as const

/** Escalating reactions when the Builder is poked repeatedly. */
export const CLICK_LINES: Record<number, string> = {
  1: 'Hmm?',
  2: 'Yes, Chief?',
  3: "I'm working.",
  4: 'Still working.',
  5: 'PLEASE.',
  6: 'This is my only hammer.',
  7: 'One more time. I dare you.',
}

export const CLICK_WALK_OFF_LINE = "That's it. Break."
export const RETURN_LINE = 'I came back. Unfortunately.'

export const DISAPPOINTED_LINES = [
  'Told you.',
  'We do not have that many gems, Chief.',
  'Seventeen. We have seventeen.',
  'The gem counter is not a suggestion.',
] as const

/** Said when a new signpost is requested and the treasury disagrees. */
export const NO_GOLD_LINES = [
  'A signpost costs a million, Chief.',
  'We cannot afford the wood.',
  'Come back with a million.',
  'That is not how budgets work.',
]

export const UPGRADE_START_LINES = [
  'Starting now. Finishing eventually.',
  'On it, Chief.',
  'This will take a while. A long while.',
  'Adding it to the pile.',
] as const

export const UPGRADE_DONE_LINES = [
  'Done. Somehow.',
  'Finished. Do not look too closely.',
  "That's one. There are others.",
  'Complete. I need a sit down.',
] as const

export const WALL_LINES = [
  'It is a wall.',
  'Higher. Sure. Why not.',
  'This is what we do here.',
  'Structurally, this is a mistake.',
] as const

export const WALL_MAX_LINE = 'Worth it.'

export const ONBOARDING_LINES = [
  'Chief?',
  'This village looks suspiciously like a browser.',
  "Anyway, I'm working here now.",
] as const

export const GEM_TAUNTS = [
  { at: 5, text: 'Nice try.' },
  { at: 10, text: 'There is no infinite gem glitch here.' },
  { at: 16, text: 'The counter goes down, Chief. Never up.' },
  { at: 24, text: 'You have clicked this more times than we have gems.' },
] as const

/** Ridiculous names for the click-to-upgrade wall easter egg. */
export const WALL_TIERS: { at: number; label: string }[] = [
  { at: 1, label: 'Wall' },
  { at: 3, label: 'Sturdy Wall' },
  { at: 6, label: 'Reinforced Wall' },
  { at: 10, label: 'Crystal Wall' },
  { at: 15, label: 'Molten Wall' },
  { at: 21, label: 'Wall of Regret' },
  { at: 28, label: 'Ancestral Wall' },
  { at: 36, label: 'Wall (Legendary)' },
  { at: 45, label: 'Wall Beyond Walls' },
  { at: 999, label: 'Wall Level 999' },
]

/** Shown in the search bar. The first entry is the default. */
export const SEARCH_PLACEHOLDERS = [
  'Najdi svou kurtizánu',
  'Search the kingdom...',
  'Ask the Search Hall...',
  'Search. The Builder is busy.',
] as const

/** Flip to true to pick a random placeholder per tab instead of the default. */
export const ROTATE_SEARCH_PLACEHOLDER = false

export const CLOSE_UPGRADE_PROMPTS = [
  'Are you sure?',
  'Builder already started.',
] as const
