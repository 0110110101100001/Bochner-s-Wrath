import type { FunctionComponent } from 'react'
import type { BuildingId } from '@/types'
import type { ArtProps } from './types'
import { BookmarkHut } from './BookmarkHut'
import { BuilderHut } from './BuilderHut'
import { ClockTower } from './ClockTower'
import { ElixirStorage } from './ElixirStorage'
import { GoldStorage } from './GoldStorage'
import { Laboratory } from './Laboratory'
import { SearchHall } from './SearchHall'

interface ArtEntry {
  Component: FunctionComponent<ArtProps>
  /** Rendered width as a percentage of the 1200px stage. */
  widthPct: number
}

export const BUILDING_ART: Record<BuildingId, ArtEntry> = {
  'search-hall': { Component: SearchHall, widthPct: 25 },
  'clock-tower': { Component: ClockTower, widthPct: 13 },
  'bookmark-hut': { Component: BookmarkHut, widthPct: 18.5 },
  'gold-storage': { Component: GoldStorage, widthPct: 16 },
  'elixir-storage': { Component: ElixirStorage, widthPct: 14.5 },
  'builder-hut': { Component: BuilderHut, widthPct: 16.5 },
  laboratory: { Component: Laboratory, widthPct: 17.5 },
}

export type { ArtProps }
