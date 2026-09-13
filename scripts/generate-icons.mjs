/**
 * Generates the extension's PNG icons from scratch.
 *
 * Chrome only accepts raster icons in the manifest, so the artwork is rasterised
 * here (supersampled polygon fills) and encoded as PNG using node's zlib.
 * No binary assets are checked in and no image library is required.
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')
const SIZES = [16, 32, 48, 128]
const SS = 4 // supersampling factor per axis

/* ---------------------------------------------------------------- painting */

class Canvas {
  constructor(size) {
    this.size = size
    this.data = new Float64Array(size * size * 4) // premultiplied-ish RGBA 0..1
  }

  blend(x, y, [r, g, b], a) {
    if (a <= 0) return
    const i = (y * this.size + x) * 4
    const d = this.data
    const inv = 1 - a
    d[i] = d[i] * inv + r * a
    d[i + 1] = d[i + 1] * inv + g * a
    d[i + 2] = d[i + 2] * inv + b * a
    d[i + 3] = d[i + 3] * inv + a
  }

  /** Fills every pixel where `inside(x, y)` is true, colour from `shade(x, y)`. */
  fill(inside, shade, alpha = 1) {
    const n = this.size
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (!inside(x + 0.5, y + 0.5)) continue
        const c = typeof shade === 'function' ? shade(x + 0.5, y + 0.5) : shade
        this.blend(x, y, c, alpha)
      }
    }
  }

  /** Box-downsample to `target` px and return 8-bit RGBA rows. */
  resolve(target) {
    const step = this.size / target
    const out = Buffer.alloc(target * target * 4)
    for (let y = 0; y < target; y++) {
      for (let x = 0; x < target; x++) {
        let r = 0, g = 0, b = 0, a = 0, n = 0
        for (let sy = 0; sy < step; sy++) {
          for (let sx = 0; sx < step; sx++) {
            const i = ((y * step + sy) * this.size + (x * step + sx)) * 4
            r += this.data[i]; g += this.data[i + 1]; b += this.data[i + 2]; a += this.data[i + 3]
            n++
          }
        }
        const o = (y * target + x) * 4
        out[o] = clamp255((r / n) * 255)
        out[o + 1] = clamp255((g / n) * 255)
        out[o + 2] = clamp255((b / n) * 255)
        out[o + 3] = clamp255((a / n) * 255)
      }
    }
    return out
  }
}

const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)))
const hex = (h) => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
]
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

/* ------------------------------------------------------------------ shapes */

const roundRect = (x, y, w, h, r) => (px, py) => {
  const cx = Math.max(x + r, Math.min(px, x + w - r))
  const cy = Math.max(y + r, Math.min(py, y + h - r))
  const dx = px - cx
  const dy = py - cy
  if (px < x || px > x + w || py < y || py > y + h) return false
  return dx * dx + dy * dy <= r * r || (px >= x + r && px <= x + w - r) || (py >= y + r && py <= y + h - r)
}

const polygon = (pts) => (px, py) => {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]
    const [xj, yj] = pts[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** Rotated rectangle described by its centre, length, thickness and angle. */
const bar = (cx, cy, len, thick, deg) => {
  const a = (deg * Math.PI) / 180
  const dx = Math.cos(a)
  const dy = Math.sin(a)
  const hx = (-dy * thick) / 2
  const hy = (dx * thick) / 2
  const ex = (dx * len) / 2
  const ey = (dy * len) / 2
  return polygon([
    [cx - ex + hx, cy - ey + hy],
    [cx + ex + hx, cy + ey + hy],
    [cx + ex - hx, cy + ey - hy],
    [cx - ex - hx, cy - ey - hy],
  ])
}

const disc = (cx, cy, r) => (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r

/* ---------------------------------------------------------------- the icon */

function paint(size) {
  const n = size * SS
  const c = new Canvas(n)
  const u = n / 128 // work in a 128-unit design space

  const skyTop = hex('#ffd979')
  const skyBottom = hex('#e8862a')
  const plate = roundRect(4 * u, 4 * u, 120 * u, 120 * u, 30 * u)

  // Badge plate with a warm vertical gradient.
  c.fill(plate, (_x, y) => mix(skyTop, skyBottom, Math.min(1, y / n)))
  // Rim light along the top, shadow at the bottom.
  c.fill(roundRect(4 * u, 4 * u, 120 * u, 46 * u, 28 * u), hex('#ffffff'), 0.16)
  c.fill(roundRect(4 * u, 86 * u, 120 * u, 38 * u, 28 * u), hex('#8a3f0d'), 0.14)

  // Grass mound at the base of the badge.
  c.fill(
    (x, y) => plate(x, y) && y > 92 * u + Math.sin((x / n) * Math.PI * 2) * 4 * u,
    (_x, y) => mix(hex('#6cbf4a'), hex('#3e8a34'), Math.min(1, (y - 90 * u) / (38 * u))),
  )

  // Hammer: handle, then head, each with a dark outline drawn underneath.
  const outline = hex('#3a2414')
  c.fill(bar(58 * u, 78 * u, 84 * u, 22 * u, -45), outline)
  c.fill(bar(86 * u, 44 * u, 54 * u, 36 * u, 45), outline)
  c.fill(bar(58 * u, 78 * u, 78 * u, 14 * u, -45), (x, y) =>
    mix(hex('#a9662f'), hex('#6d3d19'), Math.min(1, (x + y) / (1.9 * n))),
  )
  c.fill(bar(86 * u, 44 * u, 48 * u, 28 * u, 45), (x, y) =>
    mix(hex('#d3dbe6'), hex('#76839a'), Math.min(1, (x + y) / (1.7 * n))),
  )
  // Specular streak on the hammer head.
  c.fill(bar(80 * u, 38 * u, 40 * u, 7 * u, 45), hex('#ffffff'), 0.45)

  // Two tiny sparkles, because every storage building has them.
  c.fill(disc(34 * u, 34 * u, 6 * u), hex('#fff6cf'), 0.9)
  c.fill(disc(102 * u, 84 * u, 4 * u), hex('#fff6cf'), 0.7)

  return c.resolve(size)
}

/* ------------------------------------------------------------ png encoding */

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let i = 0; i < 256; i++) {
    let cc = i
    for (let k = 0; k < 8; k++) cc = cc & 1 ? 0xedb88320 ^ (cc >>> 1) : cc >>> 1
    t[i] = cc
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, body) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(body.length)
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), body])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typed))
  return Buffer.concat([len, typed, crc])
}

function encodePng(rgba, size) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // truecolour + alpha
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* -------------------------------------------------------------------- main */

mkdirSync(OUT_DIR, { recursive: true })
for (const size of SIZES) {
  const file = resolve(OUT_DIR, `icon${size}.png`)
  writeFileSync(file, encodePng(paint(size), size))
  console.log(`icons: wrote icon${size}.png`)
}
