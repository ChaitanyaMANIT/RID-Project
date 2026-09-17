import { useCallback } from 'react'

/**
 * Tiny sound effects, synthesised live in the browser.
 *
 * This is deliberate: the site has punchy audio feedback even before you add a
 * single music file, and it depends on no external URLs and no copyrighted
 * samples.
 */

export type SfxName =
  | 'tap'
  | 'pop'
  | 'sparkle'
  | 'slap'
  | 'whoosh'
  | 'crash'
  | 'chime'
  | 'win'
  | 'lose'
  | 'lit'

let ctx: AudioContext | null = null
let enabled = true

export function setSfxEnabled(next: boolean): void {
  enabled = next
}

export function isSfxEnabled(): boolean {
  return enabled
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  try {
    ctx = new Ctor()
  } catch {
    ctx = null
  }
  return ctx
}

/** Must be called from inside a user gesture at least once. */
export function unlockAudio(): void {
  const c = getCtx()
  if (c && c.state === 'suspended') void c.resume()
}

function tone(
  c: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType,
  peak: number,
  delay = 0,
  endFreq?: number,
) {
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (endFreq !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), t0 + duration)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.02, duration * 0.25))
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

function noise(
  c: AudioContext,
  duration: number,
  peak: number,
  filterFreq: number,
  delay = 0,
  sweepTo?: number,
) {
  const t0 = c.currentTime + delay
  const frames = Math.max(1, Math.floor(c.sampleRate * duration))
  const buffer = c.createBuffer(1, frames, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1

  const src = c.createBufferSource()
  src.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.9
  filter.frequency.setValueAtTime(filterFreq, t0)
  if (sweepTo !== undefined) {
    filter.frequency.exponentialRampToValueAtTime(Math.max(sweepTo, 40), t0 + duration)
  }

  const gain = c.createGain()
  gain.gain.setValueAtTime(peak, t0)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  src.connect(filter).connect(gain).connect(c.destination)
  src.start(t0)
  src.stop(t0 + duration + 0.05)
}

export function playSfx(name: SfxName): void {
  if (!enabled) return
  const c = getCtx()
  if (!c || c.state === 'suspended') return

  try {
    switch (name) {
      case 'tap':
        tone(c, 520, 0.07, 'triangle', 0.05)
        break
      case 'pop':
        tone(c, 700, 0.09, 'sine', 0.14, 0, 1150)
        break
      case 'sparkle':
        tone(c, 1320, 0.16, 'sine', 0.07)
        tone(c, 1760, 0.2, 'sine', 0.05, 0.06)
        tone(c, 2340, 0.22, 'sine', 0.035, 0.12)
        break
      case 'chime':
        tone(c, 880, 0.5, 'sine', 0.09)
        tone(c, 1320, 0.6, 'sine', 0.06, 0.05)
        break
      case 'slap':
        noise(c, 0.13, 0.4, 900, 0, 220)
        tone(c, 130, 0.16, 'square', 0.12, 0, 60)
        break
      case 'whoosh':
        noise(c, 0.34, 0.16, 500, 0, 2600)
        break
      case 'crash':
        noise(c, 0.5, 0.34, 320, 0, 90)
        tone(c, 90, 0.4, 'sawtooth', 0.13, 0, 40)
        break
      case 'lit':
        tone(c, 980, 0.12, 'sine', 0.06, 0, 1380)
        break
      case 'win':
        ;[523, 659, 784, 1046].forEach((f, i) => tone(c, f, 0.3, 'sine', 0.08, i * 0.11))
        break
      case 'lose':
        ;[392, 330, 262].forEach((f, i) => tone(c, f, 0.34, 'triangle', 0.08, i * 0.14))
        break
      default:
        break
    }
  } catch {
    /* Audio is a bonus, never a requirement. */
  }
}

export function useSfx(): (name: SfxName) => void {
  return useCallback((name: SfxName) => playSfx(name), [])
}