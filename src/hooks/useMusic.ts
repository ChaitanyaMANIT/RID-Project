import { useCallback, useEffect, useRef, useState } from 'react'
import { CROSSFADE_MS, TRACKS, TRACK_ORDER } from '../data/music'
import type { MusicKey } from '../data/chapters'
import { assetExists } from '../data/assets'

export type TrackAvailability = Record<MusicKey, boolean | null>

export interface MusicController {
  /** null = still probing, true/false = confirmed. */
  available: TrackAvailability
  probed: boolean
  /** True when at least one track file was found. */
  anyAvailable: boolean
  track: MusicKey | null
  playing: boolean
  muted: boolean
  volume: number
  play: (key: MusicKey) => void
  pause: () => void
  resume: () => void
  toggle: () => void
  stop: () => void
  setMuted: (next: boolean) => void
  setVolume: (next: number) => void
}

const UNKNOWN: TrackAvailability = { birthday: true, relatable: true, finale: true }

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * One <audio> element, soft crossfades, and total forgiveness: missing files,
 * blocked autoplay and unsupported formats all degrade to "silently no music"
 * rather than a broken player.
 */
export function useMusic(): MusicController {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const keyRef = useRef<MusicKey | null>(null)
  const fadeRef = useRef<number | null>(null)
  const tokenRef = useRef(0)
  const mutedRef = useRef(false)
  const volRef = useRef(1)
  const userPausedRef = useRef(false)

  const [available, setAvailable] = useState<TrackAvailability>(UNKNOWN)
  const [probed, setProbed] = useState(false)
  const [track, setTrack] = useState<MusicKey | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMutedState] = useState(false)
  const [volume, setVolumeState] = useState(1)

  const cancelFade = useCallback(() => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current)
      fadeRef.current = null
    }
  }, [])

  const fade = useCallback(
    (el: HTMLAudioElement, to: number, ms: number) => {
      cancelFade()
      const from = el.volume
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / Math.max(1, ms))
        el.volume = Math.max(0, Math.min(1, from + (to - from) * t))
        if (t < 1) fadeRef.current = requestAnimationFrame(tick)
        else fadeRef.current = null
      }
      fadeRef.current = requestAnimationFrame(tick)
    },
    [cancelFade],
  )

  /* Probe once so the player can say "add a track" instead of showing a dead
     button. Missing files are also caught at play() time, as a backstop. */
  useEffect(() => {
    let alive = true
    const run = async () => {
      const entries = await Promise.all(
        TRACK_ORDER.map(async (k) => [k, await assetExists(TRACKS[k].src)] as const),
      )
      if (!alive) return
      setAvailable((prev) => {
        const next = { ...prev }
        for (const [k, ok] of entries) next[k] = ok
        return next
      })
      setProbed(true)
    }
    void run()
    return () => {
      alive = false
    }
  }, [])

  const markMissing = useCallback((key: MusicKey) => {
    setAvailable((prev) => ({ ...prev, [key]: false }))
  }, [])

  const play = useCallback(
    (key: MusicKey) => {
      // Allow playing unless confirmed false
      if (available[key] === false) return
      userPausedRef.current = false
      const myToken = ++tokenRef.current

      const run = async () => {
        let el = audioRef.current
        if (!el) {
          el = new Audio()
          el.loop = true
          el.preload = 'auto'
          el.addEventListener('error', () => {
            const k = keyRef.current
            if (k) markMissing(k)
            setPlaying(false)
          })
          audioRef.current = el
        }
        const target = TRACKS[key]

        if (keyRef.current !== key) {
          if (keyRef.current) {
            fade(el, 0, 420)
            await wait(440)
            if (myToken !== tokenRef.current) return
            el.pause()
          }
          keyRef.current = key
          el.src = target.src
          setTrack(key)
        }

        el.muted = mutedRef.current
        el.volume = 0
        try {
          await el.play()
          if (myToken !== tokenRef.current) return
          setPlaying(true)
          fade(el, target.volume * volRef.current, CROSSFADE_MS)
        } catch {
          if (myToken !== tokenRef.current) return
          setPlaying(false)
        }
      }

      void run()
    },
    [available, fade, markMissing],
  )

  const pause = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    userPausedRef.current = true
    tokenRef.current += 1
    fade(el, 0, 320)
    window.setTimeout(() => el.pause(), 340)
    setPlaying(false)
  }, [fade])

  const resume = useCallback(() => {
    const key = keyRef.current ?? 'birthday'
    if (available[key] === false) return
    play(key)
  }, [available, play])

  const toggle = useCallback(() => {
    if (playing) pause()
    else resume()
  }, [pause, playing, resume])

  const stop = useCallback(() => {
    const el = audioRef.current
    tokenRef.current += 1
    keyRef.current = null
    cancelFade()
    if (el) {
      el.pause()
      el.removeAttribute('src')
    }
    setPlaying(false)
    setTrack(null)
  }, [cancelFade])

  const setMuted = useCallback(
    (next: boolean) => {
      mutedRef.current = next
      setMutedState(next)
      if (audioRef.current) audioRef.current.muted = next
      if (!next) resume()
    },
    [resume],
  )

  const setVolume = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(1, next))
      volRef.current = clamped
      setVolumeState(clamped)
      const el = audioRef.current
      const key = keyRef.current
      if (el && key && playing) {
        cancelFade()
        el.volume = Math.max(0, Math.min(1, TRACKS[key].volume * clamped))
      }
    },
    [cancelFade, playing],
  )

  useEffect(() => () => cancelFade(), [cancelFade])

  const anyAvailable = TRACK_ORDER.some((k) => available[k] === true)

  return {
    available,
    probed,
    anyAvailable,
    track,
    playing,
    muted,
    volume,
    play,
    pause,
    resume,
    toggle,
    stop,
    setMuted,
    setVolume,
  }
}