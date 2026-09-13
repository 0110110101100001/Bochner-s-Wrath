/**
 * Favicons come from Chrome's own cache via the `favicon` permission, so the
 * new tab never makes a network request to a third party.
 */
export function faviconUrl(pageUrl: string, size = 32): string | null {
  if (typeof chrome === 'undefined' || !chrome.runtime?.getURL) return null
  try {
    const url = new URL(chrome.runtime.getURL('/_favicon/'))
    url.searchParams.set('pageUrl', pageUrl)
    url.searchParams.set('size', String(size))
    return url.toString()
  } catch {
    return null
  }
}

const TILE_COLORS = ['#d94f3d', '#3f7fd6', '#4aa233', '#e0a417', '#8b5cf6', '#e06c9f', '#17a9d8']

/** Deterministic fallback tile when there is no cached favicon. */
export function monogramFor(label: string, url: string): { letter: string; color: string } {
  const letter = (label.trim()[0] ?? url.replace(/^https?:\/\//, '')[0] ?? '?').toUpperCase()
  let hash = 0
  for (let i = 0; i < url.length; i++) hash = (hash * 31 + url.charCodeAt(i)) >>> 0
  return { letter, color: TILE_COLORS[hash % TILE_COLORS.length]! }
}

/** Adds a scheme when the user typed a bare domain. */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
