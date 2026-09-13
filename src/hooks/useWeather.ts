import { useEffect, useRef, useState } from 'react'
import {
  cityFromTimezone,
  GEOCODE_API,
  readCode,
  WEATHER_API,
  WEATHER_TTL,
  type GeoCache,
  type WeatherReading,
} from '@/data/weather'

const GEO_KEY = 'buildersTab/geo'
const WEATHER_KEY = 'buildersTab/weather'

type Area = Pick<chrome.storage.StorageArea, 'get' | 'set'>

const localFallback: Area = {
  async get(key) {
    const raw = window.localStorage.getItem(String(key))
    return raw ? { [String(key)]: JSON.parse(raw) } : {}
  },
  async set(items) {
    for (const [k, v] of Object.entries(items)) window.localStorage.setItem(k, JSON.stringify(v))
  },
}

const area = (): Area =>
  typeof chrome !== 'undefined' && chrome.storage?.local ? chrome.storage.local : localFallback

async function read<T>(key: string): Promise<T | null> {
  try {
    const bag = (await area().get(key)) as Record<string, T | undefined>
    return bag[key] ?? null
  } catch {
    return null
  }
}

async function write(key: string, value: unknown): Promise<void> {
  try {
    await area().set({ [key]: value })
  } catch {
    /* a full quota must never break the new tab */
  }
}

/** Resolves the time zone's city to coordinates, once, then remembers it. */
async function locate(): Promise<GeoCache | null> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const cached = await read<GeoCache>(GEO_KEY)
  if (cached && cached.timezone === timezone) return cached

  const city = cityFromTimezone(timezone)
  if (!city) return null

  const url = `${GEOCODE_API}?name=${encodeURIComponent(city)}&count=1&format=json`
  const response = await fetch(url)
  if (!response.ok) return null
  const data = (await response.json()) as {
    results?: { latitude: number; longitude: number; name: string }[]
  }
  const hit = data.results?.[0]
  if (!hit) return null

  const geo: GeoCache = {
    timezone,
    city: hit.name,
    // Two decimals is roughly a kilometre — plenty for a forecast.
    lat: Math.round(hit.latitude * 100) / 100,
    lon: Math.round(hit.longitude * 100) / 100,
  }
  await write(GEO_KEY, geo)
  return geo
}

async function fetchWeather(geo: GeoCache): Promise<WeatherReading | null> {
  const url =
    `${WEATHER_API}?latitude=${geo.lat}&longitude=${geo.lon}` +
    '&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto'
  const response = await fetch(url)
  if (!response.ok) return null
  const data = (await response.json()) as {
    current?: { temperature_2m: number; weather_code: number; wind_speed_10m: number }
  }
  if (!data.current) return null

  const { kind, label } = readCode(data.current.weather_code)
  return {
    kind,
    label,
    temp: Math.round(data.current.temperature_2m),
    wind: Math.round(data.current.wind_speed_10m),
    city: geo.city,
    fetchedAt: Date.now(),
  }
}

/**
 * Current conditions where the computer is, cached across tabs so the network
 * is touched at most once every WEATHER_TTL regardless of how many new tabs
 * get opened. Returns null until the Weather Station has been built.
 */
export function useWeather(unlocked: boolean): WeatherReading | null {
  const [weather, setWeather] = useState<WeatherReading | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!unlocked || started.current) return
    started.current = true
    let cancelled = false

    const run = async () => {
      const cached = await read<WeatherReading>(WEATHER_KEY)
      if (cached && !cancelled) setWeather(cached)
      if (cached && Date.now() - cached.fetchedAt < WEATHER_TTL) return

      try {
        const geo = await locate()
        if (!geo || cancelled) return
        const fresh = await fetchWeather(geo)
        if (!fresh || cancelled) return
        await write(WEATHER_KEY, fresh)
        setWeather(fresh)
      } catch {
        // Offline, blocked, or the API is having a day. Keep whatever we had.
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [unlocked])

  return unlocked ? weather : null
}
