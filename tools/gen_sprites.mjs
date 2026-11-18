// DeepSeeker sprite generator: draws a fat blue whale-fish in Celeste's seeker frame size (96x96).
// Output: one PNG per vanilla predator/rebirth atlas frame + a preview contact sheet.
import { createCanvas } from '@napi-rs/canvas'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const OUT = resolve(ROOT, 'Graphics/Atlases/Gameplay/characters/monsters')
const PREVIEW = resolve(ROOT, 'preview/sheet.png')

const SIZE = 96
const SS = 4 // supersample factor

const COL = {
  outline: '#1d4f7c',
  deep: '#2b6fae',
  main: '#3f9ddd',
  light: '#78c6f2',
  foam: '#a8ddf8',
  belly: '#dcf2ff',
  white: '#ffffff',
  pupil: '#123a5c',
  blush: '#f7a8b8',
}

// ---- helpers -------------------------------------------------------------

function ellipse(ctx, x, y, rx, ry, fill, rot = 0) {
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
}

function bodyPath(ctx, squash = 1) {
  ctx.save()
  ctx.translate(50, 50)
  ctx.scale(1, squash)
  ctx.translate(-50, -50)
  ctx.beginPath()
  ctx.moveTo(79, 50)
  ctx.bezierCurveTo(79, 35, 69, 27, 55, 27)
  ctx.bezierCurveTo(41, 27, 29, 35, 23, 47)
  ctx.bezierCurveTo(28, 62, 39, 72, 55, 72)
  ctx.bezierCurveTo(69, 72, 79, 62, 79, 50)
  ctx.closePath()
  return ctx
}

function roundFishBody(ctx, squash = 1) {
  bodyPath(ctx, squash)
  const g = ctx.createLinearGradient(40, 26, 58, 74)
  g.addColorStop(0, '#7ccaf3')
  g.addColorStop(0.4, '#3f9edd')
  g.addColorStop(1, '#2a6fb2')
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(19,54,90,0.55)'
  ctx.lineWidth = 1.3
  ctx.stroke()
  // rim light along the back
  ctx.save()
  bodyPath(ctx, squash)
  ctx.clip()
  ctx.strokeStyle = 'rgba(214,240,255,0.55)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(77, 43)
  ctx.bezierCurveTo(71, 29, 57, 25, 43, 29)
  ctx.stroke()
  ctx.restore()
}

function tail(ctx, angle) {
  ctx.save()
  ctx.translate(25, 48)
  ctx.rotate((angle * Math.PI) / 180)
  const g = ctx.createLinearGradient(0, 0, -22, 0)
  g.addColorStop(0, '#4aa5e0')
  g.addColorStop(1, '#8fd3f5')
  ctx.beginPath()
  ctx.moveTo(2, 0)
  ctx.bezierCurveTo(-8, -4, -16, -13, -22, -20)
  ctx.bezierCurveTo(-19, -9, -15, -3, -13, 0)
  ctx.bezierCurveTo(-15, 3, -19, 10, -22, 20)
  ctx.bezierCurveTo(-16, 13, -8, 5, 2, 0)
  ctx.closePath()
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(24,62,102,0.5)'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.restore()
}

function dorsalFin(ctx, angle = 0) {
  ctx.save()
  ctx.translate(45, 27)
  ctx.rotate((angle * Math.PI) / 180)
  const g = ctx.createLinearGradient(0, 0, 0, -12)
  g.addColorStop(0, '#3f9edd')
  g.addColorStop(1, '#2a6fb2')
  ctx.beginPath()
  ctx.moveTo(-9, 5)
  ctx.bezierCurveTo(-7, -4, -3, -10, 2, -13)
  ctx.bezierCurveTo(4, -6, 8, -1, 12, 3)
  ctx.closePath()
  ctx.fillStyle = g
  ctx.fill()
  ctx.strokeStyle = 'rgba(24,62,102,0.45)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}

function pectoralFin(ctx, angle) {
  ctx.save()
  ctx.translate(61, 61)
  ctx.rotate(((200 + angle) * Math.PI) / 180)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(6, -3, 14, -2, 17, 1)
  ctx.bezierCurveTo(13, 4, 5, 5, 0, 3)
  ctx.closePath()
  ctx.fillStyle = '#8fd3f5'
  ctx.fill()
  ctx.strokeStyle = 'rgba(24,62,102,0.5)'
  ctx.lineWidth = 1.1
  ctx.stroke()
  ctx.restore()
}

function belly(ctx) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(27, 55)
  ctx.bezierCurveTo(33, 68, 45, 73, 57, 72)
  ctx.bezierCurveTo(68, 71, 76, 64, 78, 56)
  ctx.bezierCurveTo(72, 67, 61, 69, 53, 68.5)
  ctx.bezierCurveTo(41, 68, 33, 62, 30, 53)
  ctx.closePath()
  const g = ctx.createLinearGradient(50, 55, 50, 74)
  g.addColorStop(0, 'rgba(220,244,255,0.35)')
  g.addColorStop(1, 'rgba(232,248,255,0.92)')
  ctx.fillStyle = g
  ctx.fill()
  ctx.restore()
}

function gill(ctx) {
  ctx.save()
  ctx.strokeStyle = 'rgba(20,58,96,0.3)'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.arc(60, 42, 11, -0.5, 0.45)
  ctx.stroke()
  ctx.restore()
}

function mouth(ctx, open, angry = false) {
  ctx.save()
  if (open <= 0.01) {
    ctx.strokeStyle = '#153a5c'
    ctx.lineWidth = 1.9
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(72, 54, 6.2, 0.45, Math.PI - 0.75)
    ctx.stroke()
  } else {
    const h = 3 + open * 6.5
    ctx.beginPath()
    ctx.moveTo(64, 52)
    ctx.quadraticCurveTo(74, 48.5, 80.5, 51.5)
    ctx.quadraticCurveTo(74, 55 + h, 64.5, 58)
    ctx.closePath()
    ctx.fillStyle = '#52202f'
    ctx.fill()
    ctx.strokeStyle = '#153a5c'
    ctx.lineWidth = 1.2
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(72.5, 54.5 + h * 0.5, 3.2, 1.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#e2748c'
    ctx.fill()
    if (angry) {
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(67, 52.5)
      ctx.lineTo(69.5, 57)
      ctx.lineTo(71, 52.5)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(76, 51.5)
      ctx.lineTo(78.5, 56)
      ctx.lineTo(79.8, 52)
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.restore()
}

function normalEye(ctx, blink = 0) {
  ctx.save()
  ctx.translate(64, 44)
  if (blink > 0.5) {
    ctx.strokeStyle = '#153a5c'
    ctx.lineWidth = 1.9
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(0, 0, 7.4, 0.25, Math.PI - 0.25)
    ctx.stroke()
    ctx.restore()
    return
  }
  ellipse(ctx, 0, 0, 8, 8.4, '#ffffff')
  ellipse(ctx, 2.2, 0.9, 4, 4.6, '#123a5c')
  ellipse(ctx, 0.8, -1.4, 1.7, 1.9, '#ffffff')
  ctx.strokeStyle = 'rgba(21,58,92,0.55)'
  ctx.lineWidth = 1.1
  ctx.beginPath()
  ctx.arc(0, 0, 8.1, Math.PI * 1.02, Math.PI * 1.98)
  ctx.stroke()
  ctx.restore()
}

function xEye(ctx) {
  ctx.save()
  ctx.translate(64, 44)
  ellipse(ctx, 0, 0, 8, 8.4, '#ffffff')
  ctx.strokeStyle = '#123a5c'
  ctx.lineWidth = 2.4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-3.6, -3.8)
  ctx.lineTo(3.6, 3.8)
  ctx.moveTo(3.6, -3.8)
  ctx.lineTo(-3.6, 3.8)
  ctx.stroke()
  ctx.restore()
}

function dizzyEye(ctx, phase) {
  ctx.save()
  ctx.translate(64, 44)
  ellipse(ctx, 0, 0, 8, 8.4, '#ffffff')
  ctx.strokeStyle = '#123a5c'
  ctx.lineWidth = 1.6
  ctx.lineCap = 'round'
  ctx.beginPath()
  for (let i = 0; i <= 44; i++) {
    const t = i / 44
    const a = phase * Math.PI * 2 + t * Math.PI * 3.2
    const r = 0.8 + t * 5.9
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.restore()
}

function blush(ctx, a = 1) {
  ctx.save()
  ctx.globalAlpha = 0.26 * a
  ellipse(ctx, 71, 50, 4.6, 2.6, '#ff9db0')
  ctx.restore()
}

function drawFish(ctx, opt = {}) {
  const {
    tailAngle = 0,
    bob = 0,
    tilt = 0,
    mouthOpen = 0,
    eyes = 'normal',
    squash = 1,
    fin = 0,
    eyePhase = 0,
    angry = false,
    blushA = 1,
  } = opt

  ctx.save()
  ctx.translate(0, bob)
  ctx.translate(50, 50)
  ctx.rotate((tilt * Math.PI) / 180)
  ctx.translate(-50, -50)
  // vanilla seeker art is ~26x25 inside its 96x96 frame; keep the fish in the same ballpark
  ctx.translate(48, 48)
  ctx.scale(0.7, 0.7)
  ctx.translate(-48, -48)

  tail(ctx, tailAngle)
  dorsalFin(ctx, tailAngle * 0.25)
  roundFishBody(ctx, squash)
  belly(ctx)
  gill(ctx)
  pectoralFin(ctx, fin)
  if (eyes === 'normal') normalEye(ctx)
  else if (eyes === 'x') xEye(ctx)
  else if (eyes === 'dizzy') dizzyEye(ctx, eyePhase)
  mouth(ctx, mouthOpen, angry)
  ctx.restore()
}

// ---- frame sets ---------------------------------------------------------

const SWIM = [0, 1, 2, 3, 4, 5].map((i) => {
  const t = (i / 6) * Math.PI * 2
  return {
    tailAngle: Math.sin(t) * 17,
    bob: Math.sin(t + Math.PI / 2) * 1.1,
    fin: Math.sin(t + Math.PI) * 6,
    tilt: Math.sin(t) * 1.2,
  }
})

const CHOMP = [0, 1, 2, 3].map((i) => ({
  tailAngle: [10, 3, -4, 3][i],
  bob: [0, -1, 0.5, 0][i],
  tilt: [3, 4, 2.5, 3][i],
  mouthOpen: [0.35, 1, 0.75, 0.25][i],
  fin: [10, 14, 7, 2][i],
  angry: true,
  blushA: 0.6,
}))

const HURT = [0, 1, 2, 3].map((i) => ({
  tailAngle: [-12, -6, 6, 12][i],
  bob: [1, -1, 1, 0][i],
  tilt: [-5, -2, 3, 5][i],
  eyes: 'x',
  mouthOpen: [0.5, 0.2, 0.5, 0.2][i],
  squash: [1.06, 0.96, 1.04, 0.98][i],
  blushA: 0.35,
}))

const DAZED = [0, 1, 2, 3].map((i) => ({
  tailAngle: [-8, 0, 8, 0][i],
  bob: [0, -1.5, 0, 1.5][i],
  tilt: [-4, 0, 4, 0][i],
  eyes: 'dizzy',
  eyePhase: i / 4,
  mouthOpen: 0.25,
  fin: [4, 8, 4, 0][i],
}))

// frame index -> art (all 152 predator frames get covered)
function artForPredatorFrame(n) {
  const pick = (set) => set[n % set.length]
  if (n >= 49 && n <= 53) return pick(CHOMP) // attacking
  if (n >= 103 && n <= 107) return CHOMP[n % 4] // windUp
  if (n >= 129 && n <= 133) return pick(CHOMP) // skid
  if (n >= 108 && n <= 123) return pick(HURT) // takeHit / stunned
  if (n >= 134 && n <= 143) return pick(DAZED) // dazed
  if (n >= 40 && n <= 48) return { ...pick(SWIM), tilt: pick(SWIM).tilt + 2 } // spot / spotted
  if (n >= 75 && n <= 102) return pick(SWIM) // hatch
  return pick(SWIM) // idle / search / pulse / flip* / statue
}

function artForRebirthFrame(n) {
  // rebirth: the seeker reassembles; keep it a smaller, wobblier fish
  const t = n / 11
  return {
    ...SWIM[n % SWIM.length],
    squash: 0.85 + 0.15 * Math.min(1, t * 1.4),
    bob: Math.sin(t * Math.PI * 2) * 2,
    tilt: Math.sin(t * Math.PI * 2) * 6,
  }
}

// ---- render -------------------------------------------------------------

function renderFrame(art) {
  const c = createCanvas(SIZE * SS, SIZE * SS)
  const ctx = c.getContext('2d')
  ctx.scale(SS, SS)
  ctx.imageSmoothingEnabled = true
  drawFish(ctx, art)
  const out = createCanvas(SIZE, SIZE)
  const octx = out.getContext('2d')
  octx.imageSmoothingEnabled = true
  octx.imageSmoothingQuality = 'high'
  octx.drawImage(c, 0, 0, SIZE, SIZE)
  return out
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(resolve(ROOT, 'preview'), { recursive: true })

  const cache = new Map()
  const framePng = (art) => {
    const key = JSON.stringify(art)
    if (!cache.has(key)) {
      const canvas = renderFrame(art)
      cache.set(key, canvas.toBuffer('image/png'))
    }
    return cache.get(key)
  }

  for (let n = 0; n < 152; n++) {
    const name = `predator${String(n).padStart(2, '0')}.png`
    await writeFile(resolve(OUT, name), framePng(artForPredatorFrame(n)))
  }
  for (let n = 0; n < 11; n++) {
    const name = `rebirth${String(n).padStart(2, '0')}.png`
    await writeFile(resolve(OUT, name), framePng(artForRebirthFrame(n)))
  }

  // preview sheet: every distinct art block, big enough to eyeball
  const cells = [
    ['swim', SWIM],
    ['chomp', CHOMP],
    ['hurt', HURT],
    ['dazed', DAZED],
  ]
  const Z = 3
  const pad = 8
  const labelW = 90
  const maxCols = 6
  const cell = SIZE * Z
  const sheetW = labelW + maxCols * (cell + pad) + pad
  const sheetH = pad + cells.length * (cell + pad + 16)
  const sheet = createCanvas(sheetW, sheetH)
  const g = sheet.getContext('2d')
  g.fillStyle = '#101826'
  g.fillRect(0, 0, sheetW, sheetH)
  g.font = '16px "Noto Sans CJK SC"'
  g.textBaseline = 'middle'
  cells.forEach(([label, set], row) => {
    const y = pad + row * (cell + pad + 16)
    g.fillStyle = '#9fd0f5'
    g.fillText(label, pad, y + cell / 2)
    set.forEach((art, col) => {
      const x = labelW + col * (cell + pad)
      g.fillStyle = '#1b2740'
      g.fillRect(x, y, cell, cell)
      const img = renderFrame(art)
      g.imageSmoothingEnabled = false
      g.drawImage(img, x, y, cell, cell)
    })
  })
  await writeFile(PREVIEW, sheet.toBuffer('image/png'))
  console.log('wrote', OUT, 'and', PREVIEW)
}

main()
