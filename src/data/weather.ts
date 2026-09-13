/**
 * Real weather for wherever the computer is.
 *
 * Location is derived from the IANA time zone the browser already reports
 * (`Europe/Prague` -> `Prague`), which is then geocoded once. No geolocation
 * permission is requested and no precise position ever leaves the machine —
 * the only thing sent is a city name, and then coordinates rounded to two
 * decimals, to api.open-meteo.com.
 */

export type WeatherKind = 'clear' | 'cloudy' | 'overcast' | 'fog' | 'rain' | 'snow' | 'storm'

export interface WeatherReading {
  kind: WeatherKind
  label: string
  /** Degrees Celsius. */
  temp: number
  /** km/h. */
  wind: number
  city: string
  fetchedAt: number
}

export const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'
export const GEOCODE_API = 'https://geocoding-api.open-meteo.com/v1/search'

/** Weather is re-fetched at most this often, however many tabs you open. */
export const WEATHER_TTL = 30 * 60_000

/** A resolved city keeps working until the time zone changes. */
export interface GeoCache {
  timezone: string
  city: string
  lat: number
  lon: number
}

/** WMO weather interpretation codes, collapsed to what the village can draw. */
const CODES: { codes: number[]; kind: WeatherKind; label: string }[] = [
  { codes: [0], kind: 'clear', label: 'Clear' },
  { codes: [1], kind: 'clear', label: 'Mainly clear' },
  { codes: [2], kind: 'cloudy', label: 'Partly cloudy' },
  { codes: [3], kind: 'overcast', label: 'Overcast' },
  { codes: [45, 48], kind: 'fog', label: 'Fog' },
  { codes: [51, 53, 55], kind: 'rain', label: 'Drizzle' },
  { codes: [56, 57], kind: 'rain', label: 'Freezing drizzle' },
  { codes: [61, 63], kind: 'rain', label: 'Rain' },
  { codes: [65], kind: 'rain', label: 'Heavy rain' },
  { codes: [66, 67], kind: 'rain', label: 'Freezing rain' },
  { codes: [71, 73], kind: 'snow', label: 'Snow' },
  { codes: [75], kind: 'snow', label: 'Heavy snow' },
  { codes: [77], kind: 'snow', label: 'Snow grains' },
  { codes: [80, 81], kind: 'rain', label: 'Showers' },
  { codes: [82], kind: 'rain', label: 'Violent showers' },
  { codes: [85, 86], kind: 'snow', label: 'Snow showers' },
  { codes: [95], kind: 'storm', label: 'Thunderstorm' },
  { codes: [96, 99], kind: 'storm', label: 'Thunderstorm, hail' },
]

export function readCode(code: number): { kind: WeatherKind; label: string } {
  return CODES.find((c) => c.codes.includes(code)) ?? { kind: 'cloudy', label: 'Weather' }
}

/** `Europe/Prague` -> `Prague`. Good enough for a city-level forecast. */
export function cityFromTimezone(timezone: string): string | null {
  const tail = timezone.split('/').pop()
  if (!tail || /^(GMT|UTC)/i.test(tail) || /^[+-]?\d+$/.test(tail)) return null
  return tail.replace(/_/g, ' ')
}

/** What the Builder thinks of the forecast. */
export const WEATHER_LINES: Record<WeatherKind, string> = {
  clear: 'Good building weather. Suspicious.',
  cloudy: 'Overcast enough to stop working.',
  overcast: 'No sun. No motivation.',
  fog: 'I cannot see the wall. Maybe it is fine.',
  rain: 'The scaffolding is wet, Chief.',
  snow: 'Everything is frozen. Including me.',
  storm: 'I am not going up the tower in this.',
}
