import { memo, useCallback } from 'react'
import type { WeatherReading } from '@/data/weather'
import type { BuildingDef, BuildingId, WarState } from '@/types'
import { Building } from '@/components/Building/Building'
import { WallSegment, wallLabelOf } from '@/components/Building/art/WallSegment'
import { Builder } from '@/components/Builder/Builder'
import { WarLayer } from '@/components/War/WarLayer'
import { WeatherEffects } from '@/components/Weather/WeatherEffects'
import { BUILDINGS, WALLS } from '@/data/buildings'
import { DEV_MODE_LABELS } from '@/data/events'
import { WALL_LINES, WALL_MAX_LINE } from '@/data/jokes'
import { useBuilder } from '@/hooks/useBuilder'
import { useCollectors, useDrops } from '@/hooks/useEconomy'
import { useTick } from '@/hooks/useNow'
import { useSfx } from '@/hooks/useSfx'
import { useStage } from '@/hooks/useStage'
import { useSky } from '@/hooks/useTimeOfDay'
import { useVillageStore } from '@/hooks/useVillageStore'
import { clamp01 } from '@/utils/format'
import { pick } from '@/utils/random'
import { Collectibles } from './Collectibles'
import { FloatingNumbers } from './FloatingNumbers'
import { Island } from './Island'
import { Scenery } from './Scenery'
import { Sky } from './Sky'
import './Village.scss'

const MemoIsland = memo(Island)
const MemoScenery = memo(Scenery)
const MemoSky = memo(Sky)

interface VillageProps {
  onSelectBuilding: (def: BuildingDef) => void
  /** Pulls the camera towards the Search Hall while the search box has focus. */
  zoomed: boolean
  /** Building to light up without showing scaffolding. */
  pulseBuildingId: BuildingId | null
  /** Screensaver replay state; `phase: 'off'` when it is not running. */
  war: WarState
  /** Real conditions outside, once the Weather Station is built. */
  weather: WeatherReading | null
}

export function Village({
  onSelectBuilding,
  zoomed,
  pulseBuildingId,
  war,
  weather,
}: VillageProps) {
  const { state, actions } = useVillageStore()
  const { floats, devMode, shaking } = useStage()
  const builder = useBuilder()
  const sky = useSky()
  const sfx = useSfx()

  const animated = state.settings.animations
  const hasBuilds = state.activeUpgrades.length > 0
  useTick(hasBuilds ? 500 : null)

  // No loot to pick up while the village is being flattened.
  const peacetime = war.phase === 'off'
  const { collectors, collect } = useCollectors()
  const { drops, grab } = useDrops(peacetime)

  const progressFor = useCallback(
    (def: BuildingDef) => {
      const active = def.upgradeId
        ? state.activeUpgrades.find((u) => u.upgradeId === def.upgradeId)
        : undefined
      if (!active) return null
      const span = Math.max(1, active.endsAt - active.startedAt)
      return clamp01((Date.now() - active.startedAt) / span)
    },
    [state.activeUpgrades],
  )

  const onWallClick = useCallback(() => {
    const next = state.wallLevel >= 45 ? 999 : state.wallLevel + 1
    actions.bumpWall()
    sfx('hammer')
    if (next >= 999) {
      builder.say(WALL_MAX_LINE, { mood: 'staring', ms: 4200, lockMs: 2600 })
    } else if (next % 3 === 0) {
      builder.say(pick(WALL_LINES), { ms: 2800, lockMs: 0 })
    }
  }, [state.wallLevel, actions, sfx, builder])

  return (
    <div className={`village ${shaking ? `is-shaking is-shaking--${shaking}` : ''}`}>
      <MemoSky mix={sky.mix} celestial={sky.celestial} animated={animated} />
      <div className="village__tint" />

      <div className={`village__stage ${zoomed ? 'is-zoomed' : ''}`}>
        <MemoIsland animated={animated} />
        <MemoScenery />

        {WALLS.map((wall) =>
          wall.interactive ? (
            <button
              key={wall.id}
              type="button"
              className="wall wall--interactive"
              style={{
                left: `${wall.x}%`,
                top: `${wall.y}%`,
                width: `${10 * wall.scale}%`,
                zIndex: Math.round(wall.y * 10),
              }}
              onClick={onWallClick}
              aria-label={`${wallLabelOf(state.wallLevel)}, level ${state.wallLevel}`}
            >
              <WallSegment level={state.wallLevel} />
              <span className="wall__badge">
                {wallLabelOf(state.wallLevel)}
                <b>Lv {state.wallLevel}</b>
              </span>
            </button>
          ) : (
            <div
              key={wall.id}
              className="wall"
              style={{
                left: `${wall.x}%`,
                top: `${wall.y}%`,
                width: `${10 * wall.scale}%`,
                zIndex: Math.round(wall.y * 10),
              }}
              aria-hidden="true"
            >
              <WallSegment level={1} />
            </div>
          ),
        )}

        {BUILDINGS.map((def) => {
          const progress = progressFor(def)
          return (
            <Building
              key={def.id}
              def={def}
              level={def.upgradeId ? (state.levels[def.upgradeId] ?? 1) : 1}
              underConstruction={progress !== null}
              highlighted={def.id === pulseBuildingId}
              wrecked={war.wrecked.includes(def.id)}
              shield={war.shields[def.id] ?? null}
              shieldHeld={war.held.includes(def.id)}
              progress={progress ?? 0}
              onSelect={onSelectBuilding}
            />
          )
        })}

        {peacetime && (
          <Collectibles collectors={collectors} onCollect={collect} drops={drops} onGrab={grab} />
        )}

        <Builder />
        <WarLayer war={war} />
        <FloatingNumbers values={floats} />

        {devMode && (
          <div className="dev-labels" aria-hidden="true">
            {DEV_MODE_LABELS.map((label, i) => (
              <span
                key={label}
                className="dev-label"
                style={{
                  left: `${12 + ((i * 29) % 74)}%`,
                  top: `${22 + ((i * 41) % 58)}%`,
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <WeatherEffects weather={weather} animated={animated} />

      <div className="village__foreground" aria-hidden="true">
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path
            d="M0,140 L0,72 C120,54 210,86 330,74 C450,62 520,30 650,42 C780,54 840,86 980,78 C1120,70 1230,40 1340,56 C1390,63 1420,70 1440,74 L1440,140 Z"
            fill="var(--fg-far)"
          />
          <path
            d="M0,140 L0,96 C160,84 260,108 420,100 C580,92 700,66 860,78 C1020,90 1180,84 1320,94 C1380,98 1420,102 1440,104 L1440,140 Z"
            fill="var(--fg-near)"
          />
        </svg>
      </div>
    </div>
  )
}
