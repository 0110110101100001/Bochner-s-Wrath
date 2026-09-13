import { useMemo } from 'react'
import type { WeatherReading } from '@/data/weather'
import './Weather.scss'

const RAIN_COUNT = 44
const SNOW_COUNT = 34

/**
 * Weather over the village itself. Everything is CSS transform animation on a
 * fixed number of elements — no per-frame work and nothing to schedule.
 */
export function WeatherEffects({ weather, animated }: { weather: WeatherReading | null; animated: boolean }) {
  const drops = useMemo(
    () =>
      Array.from({ length: RAIN_COUNT }, (_, i) => {
        // Stable pseudo-random, so the rain does not reshuffle on re-render.
        const a = Math.sin(i * 17.31) * 4372.11
        const b = Math.sin(i * 5.77) * 1197.53
        return {
          left: (a - Math.floor(a)) * 106 - 3,
          delay: -((b - Math.floor(b)) * 1.4).toFixed(2),
          duration: (0.7 + (b - Math.floor(b)) * 0.5).toFixed(2),
          height: 26 + (a - Math.floor(a)) * 34,
        }
      }),
    [],
  )

  const flakes = useMemo(
    () =>
      Array.from({ length: SNOW_COUNT }, (_, i) => {
        const a = Math.sin(i * 23.13) * 7391.17
        const b = Math.sin(i * 9.41) * 2213.77
        return {
          left: (a - Math.floor(a)) * 104 - 2,
          delay: -((b - Math.floor(b)) * 9).toFixed(2),
          duration: (7 + (b - Math.floor(b)) * 7).toFixed(2),
          size: 3 + (a - Math.floor(a)) * 5,
        }
      }),
    [],
  )

  if (!weather) return null
  const { kind } = weather
  if (kind === 'clear' || kind === 'cloudy') return null

  const playState = animated ? 'running' : 'paused'

  return (
    <div className="sky-weather" aria-hidden="true">
      {(kind === 'overcast' || kind === 'storm' || kind === 'rain') && (
        <span className="sky-weather__gloom" />
      )}

      {(kind === 'rain' || kind === 'storm') &&
        drops.map((d, i) => (
          <span
            key={i}
            className="raindrop"
            style={{
              left: `${d.left}%`,
              height: `${d.height}px`,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              animationPlayState: playState,
            }}
          />
        ))}

      {kind === 'snow' &&
        flakes.map((f, i) => (
          <span
            key={i}
            className="snowflake"
            style={{
              left: `${f.left}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              animationPlayState: playState,
            }}
          />
        ))}

      {kind === 'fog' && <span className="sky-weather__fog" style={{ animationPlayState: playState }} />}

      {kind === 'storm' && <span className="sky-weather__flash" style={{ animationPlayState: playState }} />}
    </div>
  )
}
