import { useCallback, useState } from 'react'
import type { Settings as SettingsShape } from '@/types'
import { Dialog } from '@/components/Common/Dialog'
import { useSfx } from '@/hooks/useSfx'
import { useStage } from '@/hooks/useStage'
import { useVillageStore } from '@/hooks/useVillageStore'
import { formatAmount } from '@/utils/format'
import './Settings.scss'

/** Only the on/off settings; the numeric ones get their own controls. */
type BooleanSetting = {
  [K in keyof SettingsShape]: SettingsShape[K] extends boolean ? K : never
}[keyof SettingsShape]

const TOGGLES: { key: BooleanSetting; label: string; hint: string }[] = [
  { key: 'animations', label: 'Animations', hint: 'Smoke, sparkles, the Builder being dramatic.' },
  { key: 'sounds', label: 'Village Sounds', hint: 'Small synthesised effects. Off by default.' },
  { key: 'showResourceBar', label: 'Resource bar', hint: 'Hide the numbers you cannot spend anyway.' },
  { key: 'randomEvents', label: 'Random events', hint: 'Raids, sales, maintenance that is not real.' },
  { key: 'screensaver', label: 'War replay', hint: 'Leave the tab alone and the village gets attacked.' },
]

const IDLE_DELAYS = [
  { seconds: 10, label: '10s' },
  { seconds: 30, label: '30s' },
  { seconds: 60, label: '1m' },
  { seconds: 180, label: '3m' },
]

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, actions } = useVillageStore()
  const { pushToast } = useStage()
  const sfx = useSfx()
  const [confirmReset, setConfirmReset] = useState(false)

  const toggle = useCallback(
    (key: BooleanSetting) => {
      actions.updateSettings({ [key]: !state.settings[key] })
      sfx('pop')
    },
    [actions, state.settings, sfx],
  )

  return (
    <Dialog open={open} title="Village Settings" onClose={onClose} width={500}>
      <div className="settings">
        {TOGGLES.map((item) => (
          <button
            key={item.key}
            type="button"
            className="setting"
            onClick={() => toggle(item.key)}
            aria-pressed={state.settings[item.key]}
          >
            <span className="setting__text">
              <span className="setting__label">{item.label}</span>
              <span className="setting__hint">{item.hint}</span>
            </span>
            <span className={`switch ${state.settings[item.key] ? 'is-on' : ''}`}>
              <span className="switch__knob" />
            </span>
          </button>
        ))}

        <div className="setting setting--static">
          <span className="setting__text">
            <span className="setting__label">War starts after</span>
            <span className="setting__hint">How long the village stays quiet before the raid.</span>
          </span>
          <span className="segmented">
            {IDLE_DELAYS.map((option) => (
              <button
                key={option.seconds}
                type="button"
                className={state.settings.screensaverDelay === option.seconds ? 'is-active' : ''}
                disabled={!state.settings.screensaver}
                onClick={() => actions.updateSettings({ screensaverDelay: option.seconds })}
              >
                {option.label}
              </button>
            ))}
          </span>
        </div>

        <div className="setting setting--static">
          <span className="setting__text">
            <span className="setting__label">Clock format</span>
            <span className="setting__hint">The Clock Tower does not care either way.</span>
          </span>
          <span className="segmented">
            <button
              type="button"
              className={!state.settings.clock24h ? 'is-active' : ''}
              onClick={() => actions.updateSettings({ clock24h: false })}
            >
              12h
            </button>
            <button
              type="button"
              className={state.settings.clock24h ? 'is-active' : ''}
              onClick={() => actions.updateSettings({ clock24h: true })}
            >
              24h
            </button>
          </span>
        </div>

        <div className="settings__stats">
          <Stat label="Tabs opened" value={formatAmount(state.tabOpens)} />
          <Stat label="Wall level" value={formatAmount(state.wallLevel)} />
          <Stat label="Builders" value="1" />
        </div>

        <div className="settings__danger">
          <div>
            <span className="setting__label">Reset village</span>
            <span className="setting__hint">
              {confirmReset ? 'The Builder has already packed.' : 'Everything goes back to level 1.'}
            </span>
          </div>
          <button
            type="button"
            className="btn btn--danger btn--small"
            onClick={() => {
              if (!confirmReset) {
                setConfirmReset(true)
                return
              }
              actions.resetVillage()
              setConfirmReset(false)
              sfx('boom')
              pushToast({ title: 'Village reset.', body: 'Fresh dirt. Same Builder.', tone: 'danger', ttl: 3600 })
              onClose()
            }}
          >
            {confirmReset ? 'Yes, really' : 'Reset'}
          </button>
        </div>
      </div>
    </Dialog>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  )
}
