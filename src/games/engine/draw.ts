import { LOGICAL_W } from './hooks'

/**
 * Canvas drawing helpers — the site's visual vocabulary, in canvas form.
 * Everything here is hand-drawn rather than sprite-based, so the game cast
 * matches the panda used everywhere else.
 */

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

/** The mascot in miniature, so the game cast matches the rest of the site. */
export function drawPandaFace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  opts: { sunglasses?: boolean } = {},
): void {
  ctx.save()
  ctx.translate(x, y)

  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.arc(-r * 0.72, -r * 0.68, r * 0.4, 0, Math.PI * 2)
  ctx.arc(r * 0.72, -r * 0.68, r * 0.4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#FFFDF8'
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.ellipse(-r * 0.4, -r * 0.12, r * 0.26, r * 0.34, -0.28, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(r * 0.4, -r * 0.12, r * 0.26, r * 0.34, 0.28, 0, Math.PI * 2)
  ctx.fill()

  if (opts.sunglasses) {
    ctx.fillStyle = '#2E2622'
    roundRect(ctx, -r * 0.78, -r * 0.34, r * 1.56, r * 0.44, r * 0.18)
    ctx.fill()
  } else {
    ctx.fillStyle = '#FFFDF8'
    ctx.beginPath()
    ctx.arc(-r * 0.34, -r * 0.14, r * 0.13, 0, Math.PI * 2)
    ctx.arc(r * 0.34, -r * 0.14, r * 0.13, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#2E2622'
    ctx.beginPath()
    ctx.arc(-r * 0.33, -r * 0.13, r * 0.06, 0, Math.PI * 2)
    ctx.arc(r * 0.35, -r * 0.13, r * 0.06, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.ellipse(0, r * 0.28, r * 0.13, r * 0.1, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#2E2622'
  ctx.lineWidth = Math.max(1.4, r * 0.09)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, r * 0.4)
  ctx.quadraticCurveTo(-r * 0.2, r * 0.6, -r * 0.38, r * 0.44)
  ctx.moveTo(0, r * 0.4)
  ctx.quadraticCurveTo(r * 0.2, r * 0.6, r * 0.38, r * 0.44)
  ctx.stroke()

  ctx.restore()
}

/** Simran, waiting in the cage at the end of the level. */
export function drawSimran(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  tremble: number,
): void {
  ctx.save()
  ctx.translate(x + Math.sin(tremble * 11) * 1.6, y)

  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.ellipse(0, -r * 0.1, r * 1.04, r * 1.16, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#F3C7A6'
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#2E2622'
  ctx.lineWidth = Math.max(1.5, r * 0.1)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-r * 0.34, -r * 0.1)
  ctx.quadraticCurveTo(-r * 0.23, r * 0.02, -r * 0.12, -r * 0.1)
  ctx.moveTo(r * 0.34, -r * 0.1)
  ctx.quadraticCurveTo(r * 0.23, r * 0.02, r * 0.12, -r * 0.1)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(-r * 0.26, r * 0.36)
  ctx.quadraticCurveTo(0, r * 0.16, r * 0.26, r * 0.36)
  ctx.stroke()

  ctx.restore()
}

/** A dark speech bubble carrying a bad joke (or a label). */
export function drawBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
): void {
  ctx.save()
  ctx.fillStyle = '#2E2622'
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 9)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(x - 6, y + h / 2 - 1)
  ctx.lineTo(x + 6, y + h / 2 - 1)
  ctx.lineTo(x, y + h / 2 + 9)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#FFE9D6'
  ctx.font = `600 ${Math.round(h * 0.4)}px "Inter Variable", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x, y + 0.5)
  ctx.restore()
}

/** Riddhi as a tiny side-scrolling hero. Always faces the way she moves. */
export function drawHero(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: 1 | -1,
  runPhase: number,
  airborne: boolean,
): void {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(dir, 1)
  const legSwing = airborne ? 0.5 : Math.sin(runPhase * 10) * 0.65
  const armSwing = airborne ? -0.4 : Math.sin(runPhase * 10 + Math.PI) * 0.7
  const skin = '#F3C7A6'
  const shirt = '#D06A52'
  const pants = '#6F8B64'

  ctx.fillStyle = 'rgba(46,38,34,0.15)'
  ctx.beginPath()
  ctx.ellipse(0, 2, 11, 3.4, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = pants
  ctx.lineWidth = 4.4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -14)
  ctx.lineTo(6 + legSwing * 8, 0)
  ctx.moveTo(0, -14)
  ctx.lineTo(-4 - legSwing * 8, 0)
  ctx.stroke()

  ctx.strokeStyle = shirt
  ctx.lineWidth = 8.5
  ctx.beginPath()
  ctx.moveTo(-1, -26)
  ctx.lineTo(2, -14)
  ctx.stroke()

  ctx.strokeStyle = skin
  ctx.lineWidth = 3.1
  ctx.beginPath()
  ctx.moveTo(1, -24)
  ctx.lineTo(9, -19 + armSwing * 5)
  ctx.moveTo(1, -24)
  ctx.lineTo(-6, -20 - armSwing * 5)
  ctx.stroke()

  ctx.fillStyle = skin
  ctx.beginPath()
  ctx.arc(5.5, -32, 6.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.ellipse(3.4, -33.4, 6.8, 3.4, -0.18, Math.PI, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.arc(8.1, -32.4, 1.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#FFFDF8'
  ctx.beginPath()
  ctx.arc(-6.5, -24.5, 3.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#2E2622'
  ctx.lineWidth = 1.1
  ctx.stroke()
  ctx.restore()
}

/** A warm dinner-table backdrop: the Radisson, stylised. */
export function drawHall(ctx: CanvasRenderingContext2D, h: number, elapsed: number): void {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#fdf1e3')
  g.addColorStop(0.62, '#ffe9d6')
  g.addColorStop(1, '#f6dfc9')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, LOGICAL_W, h)

  // chandelier glow
  const glow = ctx.createRadialGradient(LOGICAL_W / 2, 26, 4, LOGICAL_W / 2, 26, 120)
  glow.addColorStop(0, 'rgba(232, 194, 126, 0.55)')
  glow.addColorStop(1, 'rgba(232, 194, 126, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, LOGICAL_W, 170)

  ctx.fillStyle = 'rgba(46, 38, 34, 0.7)'
  ctx.beginPath()
  ctx.moveTo(LOGICAL_W / 2 - 22, 0)
  ctx.lineTo(LOGICAL_W / 2 + 22, 0)
  ctx.lineTo(LOGICAL_W / 2 + 10, 30)
  ctx.lineTo(LOGICAL_W / 2 - 10, 30)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = 'rgba(232, 194, 126, 0.85)'
  ctx.beginPath()
  ctx.arc(LOGICAL_W / 2, 34, 5 + Math.sin(elapsed * 1.6) * 0.6, 0, Math.PI * 2)
  ctx.fill()

  // floor
  ctx.fillStyle = 'rgba(46, 38, 34, 0.06)'
  ctx.fillRect(0, h - 46, LOGICAL_W, 46)
}

/** Chaitanya as a grumpy joke monster. Faces the player. */
export function drawMonster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: 1 | -1,
  wobble: number,
  hp: number,
  maxHp: number,
): void {
  ctx.save()
  ctx.translate(x, y + Math.sin(wobble * 5) * 2)
  ctx.scale(dir, 1)
  const w = 30
  const hgt = 34
  ctx.fillStyle = 'rgba(46,38,34,0.15)'
  ctx.beginPath()
  ctx.ellipse(0, hgt / 2 + 2, 16, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  const g = ctx.createLinearGradient(0, -hgt / 2, 0, hgt / 2)
  g.addColorStop(0, '#8C77BE')
  g.addColorStop(1, '#5E4E8A')
  ctx.fillStyle = g
  roundRect(ctx, -w / 2, -hgt / 2, w, hgt, 11)
  ctx.fill()
  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.moveTo(-10, -hgt / 2 + 1)
  ctx.lineTo(-6, -hgt / 2 - 8)
  ctx.lineTo(-2, -hgt / 2 + 1)
  ctx.closePath()
  ctx.moveTo(3, -hgt / 2 + 1)
  ctx.lineTo(7, -hgt / 2 - 8)
  ctx.lineTo(11, -hgt / 2 + 1)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#FFFDF8'
  ctx.beginPath()
  ctx.arc(8.5, -4, 4.6, 0, Math.PI * 2)
  ctx.arc(-1.5, -4, 4.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2E2622'
  ctx.beginPath()
  ctx.arc(9.3, -3.6, 2, 0, Math.PI * 2)
  ctx.arc(-0.7, -3.6, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#FFFDF8'
  ctx.lineWidth = 2.2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-8, 7)
  ctx.lineTo(11, 5)
  ctx.moveTo(-6, 11)
  ctx.lineTo(9, 9)
  ctx.stroke()
  ctx.fillStyle = 'rgba(20,14,12,0.55)'
  roundRect(ctx, -w / 2, hgt / 2 + 5, w, 6, 3)
  ctx.fill()
  ctx.fillStyle = '#E8927C'
  const frac = Math.max(0, hp / Math.max(1, maxHp))
  roundRect(ctx, -w / 2, hgt / 2 + 5, w * frac, 6, 3)
  ctx.fill()
  ctx.restore()
}

/** A simple grassy platform block. */
export function drawPlatformBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  ctx.save()
  ctx.fillStyle = '#C98F5E'
  roundRect(ctx, x, y, w, h, 6)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,253,248,0.22)'
  ctx.fillRect(x + 4, y + 4, w - 8, 3)
  ctx.fillStyle = '#5B7E50'
  roundRect(ctx, x - 2, y - 7, w + 4, 12, 6)
  ctx.fill()
  ctx.restore()
}

/** A collectible coin / food token. */
export function drawToken(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  label: string,
  elapsed: number,
  seed: number,
): void {
  ctx.save()
  ctx.translate(x, y + Math.sin(elapsed * 3 + seed) * 2)
  ctx.fillStyle = 'rgba(232,194,126,0.35)'
  ctx.beginPath()
  ctx.arc(0, 0, r + 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `${Math.round(r * 1.9)}px system-ui, "Segoe UI Emoji", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 0, 1)
  ctx.restore()
}