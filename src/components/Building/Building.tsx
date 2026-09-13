import { useCallback, useRef, useState } from 'react'
import type { BuildingDef } from '@/types'
import { BUILDING_ART } from './art'
import './Building.scss'

interface BuildingProps {
  def: BuildingDef
  level: number
  /** Something is being built here right now. */
  underConstruction: boolean
  /** Temporarily lit up, e.g. while the search box has focus. */
  highlighted?: boolean
  /** Flattened during the war replay. Never persisted. */
  wrecked?: boolean
  /** The a priori estimate this building is currently hiding behind. */
  shield?: string | null
  /** That estimate actually held. */
  shieldHeld?: boolean
  /** 0..1 progress of that build. */
  progress: number
  onSelect: (def: BuildingDef) => void
}

export function Building({
  def,
  level,
  underConstruction,
  highlighted = false,
  wrecked = false,
  shield = null,
  shieldHeld = false,
  progress,
  onSelect,
}: BuildingProps) {
  const art = BUILDING_ART[def.id]
  const [poked, setPoked] = useState(false)
  const pokeTimer = useRef(0)

  const handleClick = useCallback(() => {
    setPoked(true)
    window.clearTimeout(pokeTimer.current)
    pokeTimer.current = window.setTimeout(() => setPoked(false), 420)
    onSelect(def)
  }, [def, onSelect])

  return (
    <button
      type="button"
      className={`building ${poked ? 'is-poked' : ''} ${underConstruction ? 'is-building' : ''} ${
        wrecked ? 'is-wrecked' : ''
      }`}
      style={{
        left: `${def.x}%`,
        top: `${def.y}%`,
        width: `${art.widthPct * def.scale}%`,
        zIndex: Math.round(def.y * 10),
      }}
      onClick={handleClick}
      aria-label={def.name}
    >
      <span className="building__art">
        <art.Component level={level} active={underConstruction || highlighted} />
      </span>

      {shield && (
        <span className={`building__shield ${shieldHeld ? 'is-held' : ''}`} aria-hidden="true">
          <span className="building__shield-dome" />
          <span className="building__shield-text">{shieldHeld ? `${shield} ✓` : shield}</span>
        </span>
      )}

      {wrecked && (
        <span className="building__fire" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <g className="fire-flame fire-flame--a">
              <path d="M50,26 C68,48 64,72 50,80 C36,72 32,48 50,26 Z" fill="#ff8a1e" />
              <path d="M50,44 C60,56 58,70 50,76 C42,70 40,56 50,44 Z" fill="#ffe27a" />
            </g>
            <g className="fire-flame fire-flame--b">
              <path d="M28,48 C40,62 38,78 28,84 C18,78 16,62 28,48 Z" fill="#f2650f" />
            </g>
            <g className="fire-flame fire-flame--c">
              <path d="M73,52 C83,64 81,78 73,83 C65,78 63,64 73,52 Z" fill="#f2650f" />
            </g>
          </svg>
          <span className="building__smoke">
            <svg viewBox="0 0 100 100">
              <circle className="wreck-puff wreck-puff--0" cx="50" cy="70" r="13" fill="#8d96a6" />
              <circle className="wreck-puff wreck-puff--1" cx="50" cy="70" r="10" fill="#a6afbd" />
              <circle className="wreck-puff wreck-puff--2" cx="50" cy="70" r="15" fill="#79839a" />
            </svg>
          </span>
        </span>
      )}

      {underConstruction && (
        <span className="building__scaffold" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <g stroke="#b5793d" strokeWidth="3.4" strokeLinecap="round">
              <path d="M8,98 L14,26 M92,98 L86,26" />
              <path d="M10,62 L90,62 M12,40 L88,40" />
              <path d="M10,62 L88,40 M12,40 L90,62" opacity="0.55" />
            </g>
          </svg>
          <span className="building__hammer">
            <svg viewBox="0 0 40 40">
              <path d="M8,34 L26,16" stroke="#8a5a33" strokeWidth="6" strokeLinecap="round" />
              <path d="M22,6 L36,20 L29,27 L15,13 Z" fill="#9aa3b4" stroke="#4f596c" strokeWidth="2" />
            </svg>
          </span>
          <span className="building__progress">
            <span className="building__progress-fill" style={{ transform: `scaleX(${progress})` }} />
          </span>
        </span>
      )}

      <span className="building__label">
        <span className="building__name">{def.name}</span>
        <span className="building__blurb">{def.blurb}</span>
      </span>
    </button>
  )
}
