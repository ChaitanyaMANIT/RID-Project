import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Heart, RotateCcw, Trophy } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import RunnerFigure from '../components/RunnerFigure'
import PandaCharacter from '../components/PandaCharacter'
import { VOICE } from '../data/cast'

type Phase = 'intro' | 'playing' | 'won' | 'lost'

interface Platform {
  x: number
  y: number
  w: number
  h: number
}

const WORLD_W = 1380
const GROUND_Y = 342
const PLAYER_W = 42
const PLAYER_H = 55
const PLAYER_START_X = 70
const PLAYER_START_Y = GROUND_Y - PLAYER_H
const GRAVITY = 1180
const RUN_SPEED = 245
const JUMP_SPEED = -505
const MONSTER_X = 1080
const SIMRAN_X = 1275
const MONSTER_HP = 3

const PLATFORMS: Platform[] = [
  { x: 0, y: GROUND_Y, w: 260, h: 70 },
  { x: 315, y: GROUND_Y, w: 220, h: 70 },
  { x: 590, y: 292, w: 150, h: 25 },
  { x: 775, y: GROUND_Y, w: 205, h: 70 },
  { x: 1020, y: 286, w: 160, h: 25 },
  { x: 1210, y: GROUND_Y, w: 170, h: 70 },
]

const COINS = [
  { x: 365, y: 292 },
  { x: 650, y: 245 },
  { x: 820, y: 292 },
  { x: 1070, y: 240 },
  { x: 1245, y: 292 },
]

const OBSTACLES = [
  { x: 515, y: GROUND_Y - 24, w: 26, h: 24 },
  { x: 920, y: GROUND_Y - 24, w: 26, h: 24 },
]

interface GameState {
  x: number
  y: number
  vx: number
  vy: number
  grounded: boolean
  camera: number
  hp: number
  coins: number
  monsterHits: number
  invincible: number
}

const freshState = (): GameState => ({
  x: PLAYER_START_X,
  y: PLAYER_START_Y,
  vx: 0,
  vy: 0,
  grounded: true,
  camera: 0,
  hp: 3,
  coins: 0,
  monsterHits: 0,
  invincible: 0,
})

function overlaps(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

function platformBelow(x: number, y: number, vy: number, previousBottom: number): Platform | null {
  if (vy < 0) return null
  const playerBottom = y + PLAYER_H
  return (
    PLATFORMS.find(
      (p) =>
        previousBottom <= p.y + 4 &&
        playerBottom >= p.y &&
        x + PLAYER_W > p.x + 4 &&
        x < p.x + p.w - 4,
    ) ?? null
  )
}

export default function RescueSimranGame() {
  const { sfx, markCompleted, recordScore, setSwipeLocked } = useExperience()
  const stateRef = useRef<GameState>(freshState())
  const keysRef = useRef({ left: false, right: false, jump: false })
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(0)
  const jumpLatchRef = useRef(false)
  const coinSetRef = useRef(new Set<number>())
  const [phase, setPhase] = useState<Phase>('intro')
  const [view, setView] = useState<GameState>(freshState())
  const [message, setMessage] = useState<string>(VOICE.villainTaunt)

  const resetGame = useCallback(() => {
    stateRef.current = freshState()
    coinSetRef.current = new Set()
    jumpLatchRef.current = false
    lastRef.current = 0
    setView(stateRef.current)
    setMessage(VOICE.villainTaunt)
    setPhase('playing')
    setSwipeLocked(true)
    sfx('whoosh')
  }, [sfx, setSwipeLocked])

  const win = useCallback(() => {
    if (phase !== 'playing') return
    const s = stateRef.current
    const score = s.coins * 100 + s.monsterHits * 150 + Math.max(0, s.hp) * 50
    setPhase('won')
    setSwipeLocked(false)
    markCompleted('rescue')
    recordScore('rescue', score)
    sfx('win')
  }, [phase, markCompleted, recordScore, setSwipeLocked, sfx])

  const lose = useCallback(() => {
    if (phase !== 'playing') return
    setPhase('lost')
    setSwipeLocked(false)
    sfx('lose')
  }, [phase, setSwipeLocked, sfx])

  useEffect(() => {
    if (phase !== 'playing') return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keysRef.current.left = true
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keysRef.current.right = true
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key.toLowerCase() === 'w') {
        keysRef.current.jump = true
        e.preventDefault()
      }
    }
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keysRef.current.left = false
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keysRef.current.right = false
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key.toLowerCase() === 'w') keysRef.current.jump = false
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onUp)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return

    const tick = (now: number) => {
      if (lastRef.current === 0) lastRef.current = now
      const dt = Math.min(0.035, (now - lastRef.current) / 1000)
      lastRef.current = now

      const s = stateRef.current
      const input = keysRef.current
      const previousBottom = s.y + PLAYER_H

      s.vx = input.left === input.right ? 0 : input.left ? -RUN_SPEED : RUN_SPEED
      if (input.jump && !jumpLatchRef.current && s.grounded) {
        s.vy = JUMP_SPEED
        s.grounded = false
        sfx('whoosh')
      }
      jumpLatchRef.current = input.jump

      s.vy += GRAVITY * dt
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.x = Math.max(0, Math.min(WORLD_W - PLAYER_W, s.x))

      // Resolve the monster before snapping the player onto a platform.
      // Otherwise the elevated final platform would make every jump look like
      // a normal landing and Riddhi could never stomp Chaitanya.
      let stompedMonster = false
      if (overlaps(s.x + 6, s.y + 6, 30, 45, MONSTER_X, GROUND_Y - 72, 58, 72) && s.invincible <= 0) {
        const stomping = s.vy > 70 && previousBottom <= GROUND_Y - 30
        if (stomping) {
          s.monsterHits += 1
          s.vy = -330
          s.grounded = false
          s.invincible = 0.8
          stompedMonster = true
          setMessage(s.monsterHits >= MONSTER_HP ? 'NOOOO! RIDDHI IS TOO POWERFUL!' : 'HEY! THAT WAS ONE OF MY JOKES!')
          sfx('slap')
          if (s.monsterHits >= MONSTER_HP) setMessage('MONSTER DEFEATED. Simran, RUN!')
        } else {
          s.hp -= 1
          s.x = Math.max(PLAYER_START_X, s.x - 100)
          s.invincible = 1.2
          sfx('slap')
          if (s.hp <= 0) {
            lose()
            return
          }
        }
      }

      if (!stompedMonster) {
        const landing = platformBelow(s.x, s.y, s.vy, previousBottom)
        if (landing) {
          s.y = landing.y - PLAYER_H
          s.vy = 0
          s.grounded = true
        } else {
          s.grounded = false
        }
      }

      if (s.y > 470) {
        s.hp -= 1
        s.x = Math.max(PLAYER_START_X, s.x - 170)
        s.y = PLAYER_START_Y
        s.vy = 0
        s.grounded = true
        s.invincible = 1.2
        sfx('crash')
        if (s.hp <= 0) {
          lose()
          return
        }
      }

      if (s.invincible > 0) s.invincible -= dt

      COINS.forEach((coin, i) => {
        if (!coinSetRef.current.has(i) && overlaps(s.x + 7, s.y + 8, 28, 40, coin.x - 13, coin.y - 13, 26, 26)) {
          coinSetRef.current.add(i)
          s.coins += 1
          sfx('pop')
        }
      })

      for (const obstacle of OBSTACLES) {
        if (overlaps(s.x + 7, s.y + 8, 28, 42, obstacle.x, obstacle.y, obstacle.w, obstacle.h) && s.invincible <= 0) {
          s.hp -= 1
          s.x = Math.max(PLAYER_START_X, s.x - 85)
          s.invincible = 1.2
          sfx('slap')
          if (s.hp <= 0) {
            lose()
            return
          }
        }
      }

      if (s.x + PLAYER_W >= SIMRAN_X - 18) {
        win()
        return
      }

      const cameraTarget = s.x - 270
      s.camera += (Math.max(0, Math.min(WORLD_W - 760, cameraTarget)) - s.camera) * Math.min(1, dt * 7)

      setView({ ...s })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastRef.current = 0
      setSwipeLocked(false)
    }
  }, [phase, lose, sfx, setSwipeLocked, win])

  useEffect(() => () => setSwipeLocked(false), [setSwipeLocked])

  const control = (name: 'left' | 'right' | 'jump', pressed: boolean) => {
    keysRef.current[name] = pressed
    if (name === 'jump' && !pressed) jumpLatchRef.current = false
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#151016] shadow-lift">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/20 px-3 py-2.5 text-white">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-rose">LEVEL 01</p>
            <p className="mt-0.5 text-[0.8rem] font-bold">Operation: Rescue Simran</p>
          </div>
          <div className="flex items-center gap-3 text-[0.72rem] font-semibold">
            <span>🍕 {view.coins}</span>
            <span>👹 Chaitanya</span>
            <span className="flex items-center gap-1"><Heart size={12} className="fill-rose text-rose" /> {view.hp}</span>
          </div>
        </div>

        <div className="relative aspect-[16/9] min-h-[310px] overflow-hidden bg-gradient-to-b from-[#6b9fe8] via-[#9bc5ef] to-[#f6d6b6] sm:min-h-[390px]">
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: WORLD_W, transform: `translateX(${-view.camera}px)` }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.8)_0_3%,transparent_3.5%),radial-gradient(circle_at_72%_12%,rgba(255,255,255,.55)_0_4%,transparent_4.5%)]" />

            <div className="absolute left-[120px] top-[55px] text-5xl opacity-70">☁️</div>
            <div className="absolute left-[690px] top-[80px] text-4xl opacity-60">☁️</div>
            <div className="absolute left-[1130px] top-[48px] text-5xl opacity-70">☁️</div>

            {PLATFORMS.map((p, i) => (
              <div
                key={`${p.x}-${i}`}
                className="absolute rounded-t-xl border-t-8 border-[#4d7648] bg-[#b97854] shadow-[inset_0_0_0_3px_rgba(255,255,255,.08)]"
                style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
              />
            ))}

            {OBSTACLES.map((o) => (
              <div key={o.x} className="absolute text-2xl" style={{ left: o.x - 2, top: o.y - 3 }}>
                🔺
              </div>
            ))}

            {COINS.map((coin, i) =>
              coinSetRef.current.has(i) ? null : (
                <motion.div
                  key={i}
                  animate={{ y: [0, -7, 0], rotate: [0, 8, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08 }}
                  className="absolute text-xl drop-shadow"
                  style={{ left: coin.x - 12, top: coin.y - 12 }}
                >
                  {i % 2 === 0 ? '🍕' : '🐼'}
                </motion.div>
              ),
            )}

            <motion.div
              className="absolute z-20"
              style={{ left: view.x, top: view.y }}
              animate={{ scaleX: view.vx < 0 ? -1 : 1, opacity: view.invincible > 0 ? [0.35, 1] : 1 }}
              transition={{ scaleX: { duration: 0.08 }, opacity: { duration: 0.16, repeat: view.invincible > 0 ? 3 : 0 } }}
            >
              <RunnerFigure who="riddhi" size={42} running={view.grounded && Math.abs(view.vx) > 5} />
            </motion.div>

            {/* Chaitanya monster */}
            {view.monsterHits < MONSTER_HP ? (
              <motion.div
                className="absolute z-10 flex flex-col items-center"
                animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                style={{ left: MONSTER_X, top: GROUND_Y - 86 }}
              >
                <div className="rounded-xl border-2 border-[#2e2622] bg-[#6f4e91] px-3 py-1 text-[0.58rem] font-black uppercase tracking-wider text-white shadow-lg">
                  CHAITANYA
                </div>
                <div className="mt-1 grid h-16 w-16 place-items-center rounded-[45%] border-4 border-[#2e2622] bg-[#8c77be] text-4xl shadow-xl">
                  👹
                </div>
                <div className="mt-1 flex gap-1">
                  {Array.from({ length: MONSTER_HP }, (_, i) => (
                    <span key={i} className={`h-2 w-8 rounded-full ${i < MONSTER_HP - view.monsterHits ? 'bg-rose' : 'bg-white/20'}`} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 1, y: 0, rotate: 0 }}
                animate={{ opacity: 0.55, y: 18, rotate: 14 }}
                className="absolute z-10 text-center"
                style={{ left: MONSTER_X + 8, top: GROUND_Y - 70 }}
              >
                <div className="text-4xl">😵‍💫</div>
                <div className="mt-1 rounded-full bg-white/80 px-2 py-1 text-[0.58rem] font-bold text-ink">Defeated.</div>
              </motion.div>
            )}

            {/* Simran's goal */}
            <div className="absolute z-10 flex flex-col items-center" style={{ left: SIMRAN_X, top: GROUND_Y - 105 }}>
              <div className="mb-1 rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-bold text-ink shadow">
                SIMRAN 🫶
              </div>
              <div className="relative grid h-20 w-24 place-items-center rounded-2xl border-4 border-ink bg-amber-100/90 text-4xl shadow-lg">
                👩🏻
                <div className="absolute inset-1 rounded-xl border-2 border-dashed border-rose/60" />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'intro' ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 grid place-items-center bg-[#120e13]/90 p-5 text-center backdrop-blur-sm"
              >
                <div className="max-w-md text-white">
                  <div className="mx-auto mb-3 flex items-end justify-center gap-2">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#6f4e91] text-4xl">👹</div>
                    <div className="pb-2 text-2xl">😈</div>
                  </div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-rose">Breaking news</p>
                  <h3 className="display mt-2 text-3xl font-bold">Chaitanya has become a monster.</h3>
                  <p className="mx-auto mt-3 max-w-sm text-[0.82rem] leading-relaxed text-white/70">
                    He is irritating Simran with an unlimited supply of terrible jokes. Riddhi, this is your moment.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2 text-[0.72rem] text-white/60">
                    <span>🏃 Run</span><span>•</span><span>⬆️ Jump</span><span>•</span><span>💥 Bonk</span>
                  </div>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="tap mt-6 rounded-full bg-rose px-6 py-3 text-[0.82rem] font-bold text-white shadow-lg"
                  >
                    Rescue Simran →
                  </button>
                </div>
              </motion.div>
            ) : null}

            {phase === 'won' ? (
              <motion.div
                key="won"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-30 grid place-items-center bg-[#fff8ef]/94 p-5 text-center text-ink backdrop-blur-sm"
              >
                <div>
                  <PandaCharacter size={74} mood="happy" floating />
                  <Trophy className="mx-auto mt-2 text-gold-deep" size={28} />
                  <h3 className="display mt-2 text-3xl font-bold">SIMRAN RESCUED! 🫡</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[0.85rem] leading-relaxed text-ink-soft">
                    Riddhi reached Simran, rescued her, and defeated the Chaitanya Monster once and for all. No more terrible jokes. 🫡
                  </p>
                  <p className="mt-3 hand text-2xl text-rose-deep">Riddhi: 1 · Chaitanya: 0 🏆</p>
                  <button type="button" onClick={resetGame} className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[0.8rem] font-bold text-cream-50">
                    <RotateCcw size={14} /> Play again
                  </button>
                </div>
              </motion.div>
            ) : null}

            {phase === 'lost' ? (
              <motion.div
                key="lost"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 grid place-items-center bg-[#120e13]/90 p-5 text-center text-white backdrop-blur-sm"
              >
                <div>
                  <div className="text-5xl">😵‍💫</div>
                  <h3 className="display mt-2 text-3xl font-bold">Simran is still trapped.</h3>
                  <p className="mt-2 text-[0.82rem] text-white/70">Chaitanya is already preparing another terrible joke.</p>
                  <button type="button" onClick={resetGame} className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-rose px-5 py-3 text-[0.8rem] font-bold text-white">
                    Try again
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-black/20 px-3 py-2 text-[0.68rem] text-white/65">
          <span>{phase === 'playing' ? message : "Reach Simran. That's the whole mission. 🫡"}</span>
          <span className="hidden sm:inline">← → / A D · Space / ↑</span>
        </div>

        {phase === 'playing' ? (
          <div className="flex items-center justify-between gap-3 bg-black/25 px-4 py-3 sm:hidden">
            <button
              type="button"
              aria-label="Move left"
              onPointerDown={() => control('left', true)}
              onPointerUp={() => control('left', false)}
              onPointerCancel={() => control('left', false)}
              onPointerLeave={() => control('left', false)}
              className="tap grid h-12 w-14 place-items-center rounded-xl bg-white/10 text-white active:bg-white/20"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              aria-label="Jump"
              onPointerDown={() => control('jump', true)}
              onPointerUp={() => control('jump', false)}
              onPointerCancel={() => control('jump', false)}
              className="tap grid h-12 flex-1 place-items-center rounded-xl bg-rose text-white active:scale-95"
            >
              JUMP ↑
            </button>
            <button
              type="button"
              aria-label="Move right"
              onPointerDown={() => control('right', true)}
              onPointerUp={() => control('right', false)}
              onPointerCancel={() => control('right', false)}
              onPointerLeave={() => control('right', false)}
              className="tap grid h-12 w-14 place-items-center rounded-xl bg-white/10 text-white active:bg-white/20"
            >
              <ArrowRight />
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-center text-[0.7rem] text-cream-50/45">
        Desktop: <b>← →</b> to run, <b>Space / ↑</b> to jump. Mobile: use the buttons. Jump on the monster three times.
      </p>
    </div>
  )
}
