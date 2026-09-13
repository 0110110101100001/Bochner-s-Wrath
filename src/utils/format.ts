/** Thin-space grouped numbers, the way a strategy game HUD shows them. */
export function formatAmount(value: number): string {
  return Math.max(0, Math.floor(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009')
}

/** 1 240 000 -> "1.2M". Used where a full grouped number will not fit. */
export function formatCompact(value: number): string {
  const v = Math.floor(value)
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(v >= 10_000 ? 0 : 1)}K`
  return String(v)
}

/** "13d 23h 59m" — trimmed to the two or three most significant units. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const d = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60

  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

/** Build times are advertised in days but tick down in seconds. */
export function advertisedRemaining(fakeDurationMs: number, progress: number): string {
  return formatDuration(fakeDurationMs * (1 - clamp01(progress)))
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
