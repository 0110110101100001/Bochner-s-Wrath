/**
 * Tiny synthesised UI sounds. Everything here is generated with oscillators and
 * noise buffers at runtime — there are no audio files in this project.
 */

export type SfxName = 'hammer' | 'coin' | 'pop' | 'boom' | 'sparkle' | 'deny' | 'whoosh'

let ctx: AudioContext | null = null
let master: GainNode | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = 0.16 // deliberately quiet
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function noiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  }
  return buffer
}

function blip(
  ac: AudioContext,
  type: OscillatorType,
  from: number,
  to: number,
  duration: number,
  gain: number,
  delay = 0,
) {
  const t = ac.currentTime + delay
  const osc = ac.createOscillator()
  const env = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + duration)
  env.gain.setValueAtTime(0.0001, t)
  env.gain.exponentialRampToValueAtTime(gain, t + 0.008)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(env)
  env.connect(master!)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

function thump(ac: AudioContext, duration: number, cutoff: number, gain: number, sweepTo?: number) {
  const t = ac.currentTime
  const src = ac.createBufferSource()
  src.buffer = noiseBuffer(ac, duration)
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(cutoff, t)
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, t + duration)
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, t)
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  src.connect(filter)
  filter.connect(env)
  env.connect(master!)
  src.start(t)
}

export function playSfx(name: SfxName): void {
  const ac = audio()
  if (!ac || !master) return

  switch (name) {
    case 'hammer':
      thump(ac, 0.12, 2600, 0.5, 400)
      blip(ac, 'square', 240, 90, 0.07, 0.12)
      break
    case 'coin':
      blip(ac, 'sine', 880, 900, 0.07, 0.18)
      blip(ac, 'sine', 1320, 1340, 0.1, 0.14, 0.06)
      break
    case 'pop':
      blip(ac, 'triangle', 420, 900, 0.11, 0.2)
      break
    case 'boom':
      thump(ac, 0.5, 900, 0.85, 60)
      blip(ac, 'sine', 120, 40, 0.4, 0.22)
      break
    case 'sparkle':
      blip(ac, 'sine', 1560, 1600, 0.06, 0.1)
      blip(ac, 'sine', 2080, 2100, 0.06, 0.08, 0.05)
      blip(ac, 'sine', 2600, 2620, 0.08, 0.06, 0.1)
      break
    case 'deny':
      blip(ac, 'square', 300, 150, 0.16, 0.14)
      blip(ac, 'square', 220, 110, 0.2, 0.1, 0.1)
      break
    case 'whoosh':
      thump(ac, 0.3, 1400, 0.28, 300)
      break
  }
}
