# Builder's Tab

A Chrome New Tab extension that replaces the new tab page with a small animated
fantasy village. There is a Builder. He is not thrilled about any of this.

Everything you can "upgrade" is something you already own — your search bar,
your clock, your coffee machine, a wall, another wall — and every upgrade takes
thirteen days and twenty-three hours unless you would like to finish it now for
1,827 gems, which you do not have, because you have seventeen.

All artwork is original CSS/SVG drawn for this project. No Supercell assets,
logos, fonts, sounds or UI elements are used or reproduced. This is a fan-made
parody of the genre, not a licensed product, and it does not connect to Clash of
Clans or any game API.

---

## Install

```bash
npm install
npm run build
```

Then load the built folder into Chrome:

1. Open `chrome://extensions`
2. Turn on **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select the `dist/` folder in this project
5. Open a new tab

To pick up later changes: run `npm run build` again and press the **reload**
(circular arrow) button on the extension's card in `chrome://extensions`.

> Chrome only allows one extension to own the new tab page. If nothing changes,
> another new-tab extension is probably still enabled — disable it first.

### Development

```bash
npm run dev
```

Opens the page on a local dev server with hot reload. Outside the extension the
`chrome.storage` API does not exist, so the storage layer transparently falls
back to `localStorage` and everything still works.

Other scripts:

| Script              | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run build`     | Type-check, generate icons, bundle into `dist/`     |
| `npm run typecheck` | `tsc --noEmit`                                      |
| `npm run lint`      | ESLint, zero warnings allowed                       |
| `npm run icons`     | Regenerate `public/icons/*.png` from `scripts/`     |

The extension icons are not committed as binaries — `scripts/generate-icons.mjs`
rasterises and PNG-encodes them at build time using only node's `zlib`.

---

## What is in there

**The village.** A floating island seen from a slight top-down angle, built from
layered SVG: a Search Hall, a Clock Tower, a Bookmark Hut, Gold and Elixir
storages, the Builder's Hut, the Laboratory of Questionable Productivity, and
four wall segments. Hovering a building lifts it and names it. Clicking one
opens its upgrade.

**Time of day.** The sky, the light, the shadows, the window glow, the horizon
and the foreground ridge all follow your system clock — sunrise, day, sunset and
a night with stars and a moon. Four stacked sky layers crossfade continuously,
so it never snaps from one look to the next. No location permission is used.

**The Builder.** He walks between waypoints, hammers, stares, drinks something,
drops his hammer, gets angry and sleeps at night. He stands next to whatever is
being upgraded. Poke him repeatedly and he escalates: `Hmm?` → `Yes, Chief?` →
`I'm working.` → `PLEASE.` → on the eighth poke he walks off screen and comes
back a few seconds later, grumbling. That counter is deliberately not persisted.

**Farming.** The two storages produce while the tab is closed (120 000/hour
each at level 1, multiplied by the storage's level, capped at 12 hours). Open a
tab and a bubble is waiting above each one — click to bank it. Loose coins and
droplets also land on the island while you watch and can be picked up, and every
new tab pays a small arrival bonus. Nothing produces during a raid.

**Upgrades.** Pick anything from the list. The cost comes out of your storages,
the advertised timer ticks down in days per second, and a **Finish Now** button
appears for a number of gems you will never have. Trying to close an upgrade
asks `Are you sure?`, then `Builder already started.`, and then lets you do it
anyway. Some upgrades change the village: the Clock goes plain → framed →
seconds → unnecessarily legendary, and the Search Bar picks up trim it did not
need.

**Search.** Types into the bar, hits Enter, goes to Google — or straight to the
site if what you typed looks like a URL. Focusing the field pulls the camera
towards the Search Hall and the hall's lens starts pulsing.

**Shortcuts.** Wooden signposts along the front of the island. Raising a new
one costs 1 000 000 gold — the Builder will say no if the treasury is short.
Editing and demolishing are free. Defaults live in `src/storage/defaults.ts`. Add, rename,
re-point or demolish them; icons come from Chrome's own favicon cache via the
`favicon` permission, so the page makes no network requests at all.

**War replay (the screensaver).** Leave the tab alone for ten seconds and a
clan war attack starts. Troops drop on the edge of the island, march in, flatten the
buildings one at a time and stand around cheering in the rubble while a
destruction meter climbs, stars light up and a 3:00 attack timer runs down
considerably faster than three minutes. The Builder watches it happen and has
opinions. Move the mouse and the village is instantly back, undamaged — none of
it is saved, and it never runs in a background tab. Turn it off or change the
delay (10s / 30s / 1m / 3m) in the settings.

**Weather.** The Weather Station costs 10 000 000 gold. Once built, the top-left
corner shows the real conditions where the computer is, and the village gets
them too — rain, snow, fog, gloom, a storm that flashes. Location comes from the
IANA time zone the browser already reports (`Europe/Prague` → `Prague`), which
is geocoded once; no geolocation permission is requested. This is the only part
of the extension that touches the network: a city name and then coordinates
rounded to two decimals go to open-meteo.com, at most once every 30 minutes
across all tabs. Without the station, nothing is fetched at all.

**Random events.** Opening a tab can trigger a Maintenance Break ("Just kidding.
Your browser still works."), a raid on your village (screen shake, `Damage: 0%`),
a wall sale (8 000 000 → 7 999 999), or the news that all builders are busy.
Open too many tabs in five minutes and the village suggests a Personal Break.

**Easter eggs.** Click the gem counter enough times. Click the front-right wall
enough times and watch it become something it should not be. Be awake at 3 AM.
Type `↑ ↑ ↓ ↓ ← → ← →`.

**Settings.** Gear icon, top right: animations, village sounds, resource bar,
12h/24h, random events, reset, and JSON export/import of the whole village.

**Sound.** Off by default. When enabled, every effect is synthesised at runtime
with oscillators and noise buffers — there are no audio files in this project.

---

## Performance notes

The new tab has to appear instantly, so:

- Ambient motion is CSS animation only — transform and opacity, never layout.
- React state is never driven at frame rate. The resource counters use one
  `requestAnimationFrame` tween that exists only while a number is changing;
  progress bars tick at 2 Hz and only while something is being built; the clock
  ticks once a minute unless the Clock upgrade has unlocked seconds.
- The Clock Tower's hands are pure CSS with a negative `animation-delay` taken
  from the wall clock at mount, so the tower stays in sync and never re-renders.
- Timers stop when `document.hidden` is true, and the static layers (island,
  scenery, sky) are memoised so a build timer does not re-render the village.
- The war replay is a scripted list of timeouts, not a simulation: troops move
  on CSS transitions and React only updates at the few moments something
  actually happens. It stops entirely when the tab is hidden.
- `prefers-reduced-motion` and the Animations setting both collapse every
  animation and transition.

---

## Project structure

```text
public/
  manifest.json         Manifest V3, newtab override, storage + favicon perms
  icons/                Generated PNGs
scripts/
  generate-icons.mjs    Rasteriser + PNG encoder, no dependencies
src/
  animations/           Shared framer-motion spring curves
  components/
    Builder/            The character, his moods and his speech bubble
    Building/           Building frame + per-building SVG art in art/
    Clock/              Clock with its four cosmetic levels
    Common/             Dialog, icons, animated number
    DevMode/            The banner behind the arrow-sequence easter egg
    Notification/       Toasts and full-screen event overlays
    QuickLinks/         Signposts and their editor
    ResourceBar/        Gold, Elixir and the suspicious gem count
    SearchHall/         The search bar
    Settings/           Settings dialog
    UpgradePanel/       The upgrade drawer and the Finish Now joke
    Village/            Sky, island, scenery, stage composition
    War/                Screensaver: troops, spell effects and the attack HUD
  data/                 buildings, upgrades, jokes, events, war, economy, weather
  hooks/                State container, Builder brain, timers, easter eggs
  storage/              Typed chrome.storage layer with defaults + migration
  styles/               Tokens, mixins, global styles
  utils/                Formatting, time of day, favicons, sound synthesis
```

Game logic lives in `hooks/` and `data/`; components only render. Adding a new
Builder line means appending a string to an array in `src/data/jokes.ts`, and
adding a new upgrade means one entry in `src/data/upgrades.ts`.

---

## Storage

Everything is kept under a single `chrome.storage.local` key and merged against
defaults on read, so an older save never breaks a newer build:

- shortcuts, settings, cosmetic building levels
- fake resources and active upgrades
- the easter-egg wall level
- when each storage was last collected
- number of tabs opened and the timestamps of recent ones
- `onboardingCompleted`

Nothing leaves your machine except the weather lookup described above, and only
once the Weather Station has been built. There is no backend and no analytics.
