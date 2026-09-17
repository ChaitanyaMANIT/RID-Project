import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Shared arcade plumbing for both canvas games.
 *
 * Games are drawn in a fixed 400-unit-wide logical space and scaled to whatever
 * the phone gives us, so the same tuning values feel identical on a small
 * Android and a big desktop monitor instead of the desktop version being a
 * shrunk-down copy.
 */

export const LOGICAL_W = 400

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}

export interface Viewport {
  /** Logical height for the current canvas shape. */
  h: number
  /** Device pixel ratio, capped so big phones do not melt. */
  dpr: number
}

/** Measures the canvas wrapper and keeps the backing store crisp. */
export function useGameViewport(): {
  wrapRef: RefObject<HTMLDivElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  viewport: Viewport
} {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [viewport, setViewport] = useState<Viewport>({ h: 560, dpr: 1 })

  useEffect(() => {
    const el = wrapRef.current
    const canvas = canvasRef.current
    if (!el || !canvas) return

    const apply = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const scale = rect.width / LOGICAL_W
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      setViewport({ h: Math.round(rect.height / scale), dpr })
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { wrapRef, canvasRef, viewport }
}

/**
 * requestAnimationFrame loop with a clamped delta. It also drops the clock when
 * the tab is hidden — she will absolutely get a call mid-game.
 */
export function useGameLoop(
  callback: (dt: number, elapsed: number) => void,
  running: boolean,
): void {
  const cbRef = useRef(callback)
  cbRef.current = callback
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(0)
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const step = (now: number) => {
      if (lastRef.current === 0) lastRef.current = now
      const dt = Math.min(0.05, (now - lastRef.current) / 1000)
      lastRef.current = now
      elapsedRef.current += dt
      cbRef.current(dt, elapsedRef.current)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastRef.current = 0
    }
  }, [running])

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) lastRef.current = 0
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])
}

/** Drag with a thumb, or steer with the arrow keys on a laptop. */
export function useGameInput(canvasRef: RefObject<HTMLCanvasElement | null>): {
  targetX: RefObject<number>
  dragging: RefObject<boolean>
} {
  const targetX = useRef(LOGICAL_W / 2)
  const dragging = useRef(false)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    const toLogical = (clientX: number) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return targetX.current
      return ((clientX - rect.left) / rect.width) * LOGICAL_W
    }

    const down = (e: PointerEvent) => {
      dragging.current = true
      targetX.current = toLogical(e.clientX)
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (dragging.current || e.pointerType === 'mouse') targetX.current = toLogical(e.clientX)
    }
    const up = () => {
      dragging.current = false
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetX.current = clamp(targetX.current - 46, 26, LOGICAL_W - 26)
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetX.current = clamp(targetX.current + 46, 26, LOGICAL_W - 26)
      }
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('pointerleave', up)
    window.addEventListener('keydown', key)

    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('pointerleave', up)
      window.removeEventListener('keydown', key)
    }
  }, [canvasRef])

  return { targetX, dragging }
}