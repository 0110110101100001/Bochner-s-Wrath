import { useCallback, useRef, useState } from 'react'
import type { BuildingDef, UpgradeId } from '@/types'
import { Clock } from '@/components/Clock/Clock'
import { GearIcon, HammerIcon, SoundIcon } from '@/components/Common/Icons'
import { DevBanner } from '@/components/DevMode/DevBanner'
import { EventOverlay } from '@/components/Notification/EventOverlay'
import { Notifications } from '@/components/Notification/Notifications'
import { QuickLinks } from '@/components/QuickLinks/QuickLinks'
import { ResourceBar } from '@/components/ResourceBar/ResourceBar'
import { SearchBar } from '@/components/SearchHall/SearchBar'
import { SettingsPanel } from '@/components/Settings/Settings'
import { UpgradePanel } from '@/components/UpgradePanel/UpgradePanel'
import { Village } from '@/components/Village/Village'
import { WeatherWidget } from '@/components/Weather/WeatherWidget'
import { WarHud } from '@/components/War/WarHud'
import { useArrivalEvents } from '@/hooks/useArrivalEvents'
import { useBuilder } from '@/hooks/useBuilder'
import { useIdle } from '@/hooks/useIdle'
import { useKonami } from '@/hooks/useKonami'
import { useOnboarding } from '@/hooks/useOnboarding'
import { usePageVisible } from '@/hooks/usePageVisible'
import { useSfx } from '@/hooks/useSfx'
import { useStage } from '@/hooks/useStage'
import { useSky } from '@/hooks/useTimeOfDay'
import { useBuilderWorkSite, useUpgradeCompletion } from '@/hooks/useUpgrades'
import { useVillageStore } from '@/hooks/useVillageStore'
import { useWeather } from '@/hooks/useWeather'
import { useWar } from '@/hooks/useWar'
import { playSfx } from '@/utils/sfx'
import './App.scss'

export function App() {
  const { state, ready, actions } = useVillageStore()
  const { toasts, dismissToast, devMode, toggleDevMode, pushToast } = useStage()
  const builder = useBuilder()
  const sky = useSky()
  const sfx = useSfx()
  const pageVisible = usePageVisible()

  const [panelOpen, setPanelOpen] = useState(false)
  const [focusUpgrade, setFocusUpgrade] = useState<UpgradeId | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [hallPulse, setHallPulse] = useState(false)
  const devTimer = useRef(0)

  useUpgradeCompletion()
  useBuilderWorkSite()
  const hudVisible = useOnboarding(ready)
  const weather = useWeather((state.levels['weather-station'] ?? 1) >= 2)
  const overlay = useArrivalEvents(ready && state.onboardingCompleted && hudVisible)

  // The screensaver only arms once the village is settled and nothing is open.
  const screensaverArmed =
    state.settings.screensaver &&
    hudVisible &&
    !panelOpen &&
    !settingsOpen &&
    !searchFocused &&
    overlay === null
  const idle = useIdle(state.settings.screensaverDelay * 1000, screensaverArmed)
  // Never animate a battle in a tab nobody is looking at.
  const warActive = screensaverArmed && idle && pageVisible
  const war = useWar(warActive)

  useKonami(
    useCallback(() => {
      toggleDevMode(true)
      sfx('sparkle')
      builder.say('That is not a real feature.', { mood: 'staring', ms: 3600, lockMs: 2200 })
      window.clearTimeout(devTimer.current)
      devTimer.current = window.setTimeout(() => toggleDevMode(false), 12_000)
    }, [toggleDevMode, sfx, builder]),
  )

  const onSelectBuilding = useCallback(
    (def: BuildingDef) => {
      sfx('pop')
      if (def.upgradeId) {
        setFocusUpgrade(def.upgradeId)
        setPanelOpen(true)
        return
      }
      pushToast({
        title: def.name,
        body: def.blurb,
        tone: def.id === 'gold-storage' ? 'gold' : 'gem',
        ttl: 3400,
      })
    },
    [sfx, pushToast],
  )

  const onSearchSubmit = useCallback(() => {
    setHallPulse(true)
    window.setTimeout(() => setHallPulse(false), 400)
  }, [])

  const toggleSound = useCallback(() => {
    const next = !state.settings.sounds
    actions.updateSettings({ sounds: next })
    // Play straight through the synth so enabling it is audible right away.
    if (next) playSfx('coin')
  }, [state.settings.sounds, actions])

  const { settings } = state
  const activeCount = state.activeUpgrades.length

  return (
    <div
      className={`app ${settings.animations ? '' : 'no-motion'} ${devMode ? 'is-dev' : ''}`}
      data-tod={sky.tod}
    >
      <Village
        onSelectBuilding={onSelectBuilding}
        zoomed={searchFocused}
        pulseBuildingId={hallPulse || searchFocused ? 'search-hall' : null}
        war={war}
        weather={weather}
      />

      <div className={`hud ${hudVisible && !warActive ? 'is-visible' : ''}`}>
        <div className="hud__top">
          <div className="hud__top-left">
            {settings.showResourceBar && <ResourceBar />}
            <WeatherWidget weather={weather} />
            <Notifications toasts={toasts} onDismiss={dismissToast} />
          </div>

          <div className="hud__top-right">
            <Clock />
            <div className="hud__buttons">
              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  sfx('pop')
                  setSettingsOpen(true)
                }}
                aria-label="Settings"
                title="Settings"
              >
                <GearIcon />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={toggleSound}
                aria-label={settings.sounds ? 'Mute village sounds' : 'Enable village sounds'}
                title="Village Sounds"
              >
                <SoundIcon on={settings.sounds} />
              </button>
            </div>
          </div>
        </div>

        <div className="hud__middle">
          <SearchBar onFocusChange={setSearchFocused} onSubmitStart={onSearchSubmit} />
        </div>

        <div className="hud__bottom">
          <QuickLinks />
        </div>

        <button
          type="button"
          className="upgrade-fab"
          onClick={() => {
            sfx('hammer')
            setFocusUpgrade(null)
            setPanelOpen((v) => !v)
          }}
          aria-label="Open upgrades"
          title="Upgrades"
        >
          <HammerIcon />
          {activeCount > 0 && <span className="upgrade-fab__count">{activeCount}</span>}
        </button>
      </div>

      <UpgradePanel open={panelOpen} onClose={() => setPanelOpen(false)} focusId={focusUpgrade} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <EventOverlay event={overlay} />
      {warActive && <WarHud war={war} />}

      {devMode && <DevBanner />}
    </div>
  )
}
