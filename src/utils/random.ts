export function pick<T>(items: readonly T[]): T {
  // Callers always pass non-empty literal arrays from src/data.
  return items[Math.floor(Math.random() * items.length)] as T
}

/** Picks from `items` while avoiding `previous`, when there is a choice. */
export function pickOther<T>(items: readonly T[], previous: T | null): T {
  if (items.length < 2 || previous === null) return pick(items)
  let next = pick(items)
  for (let guard = 0; next === previous && guard < 8; guard++) next = pick(items)
  return next
}

export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function randFloat(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function chance(probability: number): boolean {
  return Math.random() < probability
}

let seq = 0
export function uid(prefix = 'id'): string {
  seq += 1
  return `${prefix}-${Date.now().toString(36)}-${seq}`
}
