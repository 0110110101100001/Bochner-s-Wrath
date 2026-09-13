import { useCallback } from 'react'
import { GoldIcon } from '@/components/Common/Icons'
import { WEATHER_STATION_COST } from '@/data/economy'
import { NO_GOLD_LINES } from '@/data/jokes'
import type { WeatherKind, WeatherReading } from '@/data/weather'
import { useBuilder } from '@/hooks/useBuilder'
import { useSfx } from '@/hooks/useSfx'
import { useStage } from '@/hooks/useStage'
import { useVillageStore } from '@/hooks/useVillageStore'
import { formatAmount, formatCompact } from '@/utils/format'
import { pick } from '@/utils/random'
import './Weather.scss'

/**
 * Occupies its own slot under the resource bar from the very first tab: first
 * as a price tag you can click, then as the actual forecast.
 */
export function WeatherWidget({ weather }: { weather: WeatherReading | null }) {
  const { state, actions } = useVillageStore()
  const { pushToast } = useStage()
  const builder = useBuilder()
  const sfx = useSfx()

  const built = (state.levels['weather-station'] ?? 1) >= 2
  const canAfford = state.resources.gold >= WEATHER_STATION_COST

  const buy = useCallback(() => {
    if (state.resources.gold < WEATHER_STATION_COST) {
      sfx('deny')
      pushToast({
        title: 'Not enough gold.',
        body: `A Weather Station costs ${formatAmount(WEATHER_STATION_COST)}.`,
        tone: 'danger',
        ttl: 3800,
      })
      builder.say(pick(NO_GOLD_LINES), { mood: 'disappointed', ms: 3000, lockMs: 2200 })
      return
    }
    actions.purchase('weather-station', 2, WEATHER_STATION_COST, 'gold')
    sfx('sparkle')
    pushToast({
      title: 'Weather Station built.',
      body: 'The village now knows what it is like outside.',
      tone: 'gem',
      ttl: 4000,
    })
    builder.say('Now we can see the rain coming. Wonderful.', { ms: 3600, lockMs: 1400 })
  }, [state.resources.gold, actions, sfx, pushToast, builder])

  if (!built) {
    return (
      <button
        type="button"
        className={`weather weather--locked ${canAfford ? '' : 'is-broke'}`}
        onClick={buy}
        aria-label={`Build the Weather Station for ${formatAmount(WEATHER_STATION_COST)} gold`}
      >
        <span className="weather__glyph" aria-hidden="true">
          <WeatherGlyph kind="cloudy" />
        </span>
        <span className="weather__text">
          <span className="weather__label">Weather Station</span>
          <span className="weather__meta">Build it to see the real sky</span>
        </span>
        <span className="weather__price">
          <GoldIcon />
          {formatCompact(WEATHER_STATION_COST)}
        </span>
      </button>
    )
  }

  if (!weather) {
    return (
      <div className="weather weather--waiting">
        <span className="weather__glyph" aria-hidden="true">
          <WeatherGlyph kind="cloudy" />
        </span>
        <span className="weather__text">
          <span className="weather__label">Weather Station</span>
          <span className="weather__meta">Reading the sky…</span>
        </span>
      </div>
    )
  }

  return (
    <div className={`weather weather--${weather.kind}`} title={weather.city}>
      <span className="weather__glyph" aria-hidden="true">
        <WeatherGlyph kind={weather.kind} />
      </span>
      <span className="weather__text">
        <span className="weather__label">{weather.label}</span>
        <span className="weather__meta">
          {weather.city} · {weather.wind} km/h
        </span>
      </span>
      <span className="weather__temp">
        {weather.temp}
        <i>°</i>
      </span>
    </div>
  )
}

function WeatherGlyph({ kind }: { kind: WeatherKind }) {
  const cloud = (
    <path
      d="M16,40 a11,11 0 0,1 1,-21.8 a14,14 0 0,1 26.5,3.4 a9.5,9.5 0 0,1 -2.5,18.4 Z"
      fill="#d7e2f2"
      stroke="#7d8ba3"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  )

  return (
    <svg viewBox="0 0 60 60">
      {(kind === 'clear' || kind === 'cloudy') && (
        <g className="weather__sun">
          <circle cx={kind === 'clear' ? 30 : 20} cy={kind === 'clear' ? 28 : 20} r="12" fill="#ffd24a" />
          {kind === 'clear' &&
            [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line
                key={a}
                x1={30 + Math.cos((a * Math.PI) / 180) * 17}
                y1={28 + Math.sin((a * Math.PI) / 180) * 17}
                x2={30 + Math.cos((a * Math.PI) / 180) * 23}
                y2={28 + Math.sin((a * Math.PI) / 180) * 23}
                stroke="#ffd24a"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            ))}
        </g>
      )}

      {kind !== 'clear' && cloud}

      {kind === 'fog' && (
        <g stroke="#aebbd0" strokeWidth="3.4" strokeLinecap="round" className="weather__fog">
          <line x1="10" y1="47" x2="46" y2="47" />
          <line x1="16" y1="54" x2="52" y2="54" />
        </g>
      )}

      {(kind === 'rain' || kind === 'storm') && (
        <g className="weather__drops" stroke="#63b7f0" strokeWidth="3.4" strokeLinecap="round">
          <line x1="20" y1="44" x2="16" y2="54" />
          <line x1="31" y1="44" x2="27" y2="54" />
          <line x1="42" y1="44" x2="38" y2="54" />
        </g>
      )}

      {kind === 'storm' && <path d="M36,42 L28,54 L34,54 L27,66 L44,50 L36,50 L42,42 Z" fill="#ffd24a" />}

      {kind === 'snow' && (
        <g className="weather__flakes" fill="#e8f4ff">
          <circle cx="20" cy="48" r="3.4" />
          <circle cx="31" cy="52" r="3.4" />
          <circle cx="42" cy="48" r="3.4" />
        </g>
      )}
    </svg>
  )
}
