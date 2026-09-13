import { useMemo, useRef, useState, type FormEvent } from 'react'
import { ROTATE_SEARCH_PLACEHOLDER, SEARCH_PLACEHOLDERS } from '@/data/jokes'
import { useSfx } from '@/hooks/useSfx'
import { useVillageStore } from '@/hooks/useVillageStore'
import { pick } from '@/utils/random'
import './SearchBar.scss'

interface SearchBarProps {
  onFocusChange: (focused: boolean) => void
  /** Fires just before navigating so the Search Hall can react. */
  onSubmitStart: () => void
}

const LOOKS_LIKE_URL = /^(https?:\/\/|localhost[:/]|(\w[\w-]*\.)+[a-z]{2,}(\/|$))/i

function destinationFor(query: string): string {
  const trimmed = query.trim()
  if (LOOKS_LIKE_URL.test(trimmed)) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  }
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
}

export function SearchBar({ onFocusChange, onSubmitStart }: SearchBarProps) {
  const { state } = useVillageStore()
  const sfx = useSfx()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [launching, setLaunching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const placeholder = useMemo(
    () => (ROTATE_SEARCH_PLACEHOLDER ? pick(SEARCH_PLACEHOLDERS) : SEARCH_PLACEHOLDERS[0]),
    [],
  )

  const level = Math.min(state.levels['search-bar'] ?? 1, 4)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!value.trim() || launching) return

    setLaunching(true)
    onSubmitStart()
    sfx('whoosh')
    const target = destinationFor(value)
    // Give the hall its moment before the tab navigates away.
    window.setTimeout(() => window.location.assign(target), 220)
  }

  return (
    <form
      className={`search search--lv${level} ${focused ? 'is-focused' : ''} ${launching ? 'is-launching' : ''}`}
      onSubmit={submit}
      role="search"
    >
      <span className="search__lens" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle cx="18" cy="17" r="10.5" fill="#a9dcf5" opacity="0.5" />
          <circle cx="18" cy="17" r="10.5" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M14,11 a8,8 0 0,0 -4,7" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.9" />
          <path d="M26,26 L34,34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </span>

      <input
        ref={inputRef}
        className="search__input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          setFocused(true)
          onFocusChange(true)
        }}
        onBlur={() => {
          setFocused(false)
          onFocusChange(false)
        }}
        aria-label="Search"
      />

      <button type="submit" className="search__go" aria-label="Search" disabled={!value.trim()}>
        <svg viewBox="0 0 32 32">
          <path d="M6,16 H24 M17,9 L24,16 L17,23" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <span className="search__rune search__rune--l" aria-hidden="true" />
      <span className="search__rune search__rune--r" aria-hidden="true" />
    </form>
  )
}
