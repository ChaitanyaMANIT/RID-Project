import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, Timer } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import { GAME_COPY } from '../data/cast'
import { LOGICAL_W, pick, rand, useGameInput, useGameLoop, useGameViewport } from './engine/hooks'
import { drawPandaFace, roundRect } from './engine/draw'

type Phase = 'ready' | 'playing' | 'done'

const FOOD = ['🍕', '🍜', '☕', '', '🍩', '🍫', '🍪', ''] as const
const DURATION = 45

interface Drop {
  id: number
  x: number
  y: number
  vy: number
  rot: number
  spin: number
  label: string
  r: number
  power: boolean
}

/** Feed the Panda. One mechanic, done properly, over in 45 seconds. */
export default function FeedPandaGame() {
  const { sfx, markCompleted, recordScore, best, addFood, setSwipeLocked, reducedMotion } =
    useExperience()
  const { wrapRef, canvasRef, viewport } = useGameViewport()
  const { targetX } = useGameInput(canvasRef)

  const pandaX = useRef(LOGICAL_W / 2)
  const drops = useRef<Drop[]>([])
  const nextId = useRef(1)
  const spawnIn = useRef(0.4)
  const left = useRef(DURATION)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const uiTimer = useRef(0)

  const [phase, setPhase] = useState<Phase>('ready')
  const [hud, setHud] = useState({ score: 0, combo: 0, left: DURATION })

  useEffect(() => {
    setSwipeLocked(phase === 'playing')
    return () => setSwipeLocked(false)
  }, [phase, setSwipeLocked])

  const start = () => {
    drops.current = []
    nextId.current = 1
    spawnIn.current = 0.4
    left.current = DURATION
    scoreRef.current = 0
    comboRef.current = 0
    pandaX.current = LOGICAL_W / 2
    targetX.current = LOGICAL_W / 2
    setHud({ score: 0, combo: 0, left: DURATION })
    setPhase('playing')
    sfx('whoosh')
  }

  const finish = () => {
    const score = scoreRef.current
    setPhase('done')
    markCompleted('feed')
    recordScore('feed', score)
    addFood(Math.min(40, 8 + Math.round(score / 12)))
    sfx(score > 120 ? 'win' : 'chime')
  }

  useGameLoop(
    (dt) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      const h = viewport.h

      left.current -= dt
      pandaX.current += (targetX.current - pandaX.current) * Math.min(1, dt * 15)

      spawnIn.current -= dt
      if (spawnIn.current <= 0 && left.current > 3) {
        const power = Math.random() < 0.12
        drops.current.push({
          id: nextId.current++,
          x: rand(30, 370),
          y: -22,
          vy: (h / 600) * rand(165, 245),
          rot: 0,
          spin: rand(-1.6, 1.6),
          label: pick(FOOD),
          r: power ? 17 : 15,
          power,
        })
        spawnIn.current = rand(0.42, 0.78)
      }

      const pandaY = h - 58
      for (const d of drops.current) {
        d.y += d.vy * dt
        d.rot += d.spin * dt
        const dx = d.x - pandaX.current
        const dy = d.y - pandaY
        if (dx * dx + dy * dy < (20 + d.r) * (20 + d.r)) {
          d.x = -999
          comboRef.current += 1
          scoreRef.current += (d.power ? 14 : 8) + Math.min(12, comboRef.current)
          sfx(d.power ? 'sparkle' : 'pop')
        }
      }
      drops.current = drops.current.filter((d) => d.y < h + 40 && d.x > -500)

      uiTimer.current += dt
      if (uiTimer.current > 0.12) {
        uiTimer.current = 0
        setHud({
          score: scoreRef.current,
          combo: comboRef.current,
          left: Math.max(0, Math.ceil(left.current)),
        })
      }

      if (left.current <= 0) {
        finish()
        return
      }

      const scale = canvas.clientWidth / LOGICAL_W
      const dpr = viewport.dpr
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0)

      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#fdf5ea')
      g.addColorStop(0.6, '#fdeee0')
      g.addColorStop(1, '#f6e3cd')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, LOGICAL_W, h)

      ctx.fillStyle = 'rgba(46, 38, 34, 0.07)'
      ctx.fillRect(0, h - 40, LOGICAL_W, 40)

      for (const d of drops.current) {
        if (d.x < -100) continue
        ctx.save()
        ctx.translate(d.x, d.y)
        if (d.power) {
          ctx.fillStyle = 'rgba(232, 194, 126, 0.4)'
          ctx.beginPath()
          ctx.arc(0, 0, d.r * 1.8, 0, Math.PI * 2)
          ctx.fill()
          drawPandaFace(ctx, 0, 0, d.r)
        } else {
          ctx.rotate(d.rot)
          ctx.font = `${d.r * 1.9}px system-ui, "Segoe UI Emoji", sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(d.label, 0, 0)
        }
        ctx.restore()
      }

      ctx.fillStyle = 'rgba(46, 38, 34, 0.12)'
      ctx.beginPath()
      ctx.ellipse(pandaX.current, pandaY + 34, 34, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFFDF8'
      roundRect(ctx, pandaX.current - 30, pandaY - 6, 60, 44, 20)
      ctx.fill()
      drawPandaFace(ctx, pandaX.current, pandaY - 2, 24, { sunglasses: comboRef.current >= 8 })

      if (comboRef.current > 2) {
        ctx.fillStyle = '#C9A055'
        ctx.font = '800 15px "Fraunces Variable", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText(`x${comboRef.current}`, pandaX.current, pandaY - 42)
      }
    },
    phase === 'playing',
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/65 px-3.5 py-2.5 text-ink backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-[0.78rem] font-semibold">
          <Timer size={13} className={hud.left <= 10 ? 'text-rose-deep' : 'text-ink-soft'} />
          {phase === 'playing' ? `${hud.left}s left` : `${DURATION}s`}
        </span>
        <span className="text-[0.78rem] font-bold">{hud.score} pts</span>
        {hud.combo > 1 ? (
          <span className="text-[0.72rem] font-semibold text-gold-deep">combo x{hud.combo}</span>
        ) : null}
      </div>

      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-card border border-white/60 shadow-soft"
        style={{ aspectRatio: '4 / 3' }}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ touchAction: 'none', cursor: 'ew-resize' }}
        />

        <AnimatePresence>
          {phase !== 'playing' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center overflow-y-auto bg-cream-50/90 px-4 py-5 text-center backdrop-blur-sm"
            >
              <div className="max-w-sm">
                {phase === 'ready' ? (
                  <>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-rose-deep">
                      {GAME_COPY.feed.tagline}
                    </p>
                    <h4 className="display mt-2 text-2xl text-ink">{GAME_COPY.feed.title}</h4>
                    <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-soft">
                      {GAME_COPY.feed.intro}
                    </p>
                    <ul className="mt-3 space-y-1 text-left text-[0.74rem] leading-snug text-ink-soft/85">
                      {GAME_COPY.feed.howTo.map((line) => (
                        <li key={line}>• {line}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h4 className="display text-2xl text-ink sm:text-3xl">{GAME_COPY.feed.win}</h4>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
                      {GAME_COPY.feed.winSub}
                    </p>
                    <p className="mt-2 text-[0.8rem] font-semibold text-gold-deep">
                      {hud.score} points
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={start}
                  className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[0.85rem] font-semibold text-cream-50"
                >
                  {phase === 'ready' ? (
                    'Feed the panda'
                  ) : (
                    <>
                      <RotateCcw size={14} /> Go again
                    </>
                  )}
                </button>
                {!reducedMotion ? (
                  <p className="mt-3 text-[0.68rem] text-ink-soft/70">
                    Best score so far: {best.feed ?? 0}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <p className="text-[0.72rem] leading-relaxed text-ink-soft/80">
        Chain catches for a combo multiplier. Every panda you feed also fills the Food Meter,
        which is the only statistic this entire website keeps.
      </p>
    </div>
  )
}