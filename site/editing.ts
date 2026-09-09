import { bitmapSize, toRuns, type Bitmap, type Palette } from '@kreeptales/pixel-glyph'
import type { Drawing } from './presets'

/** Drawings up to this size share as a link without a warning. */
export const MAX_SIDE = 64
/** Larger images are refused: the playground is for sprites, not photos. */
export const HARD_MAX_SIDE = 256
/** Characters handed out to imported colors and new palette entries. No quotes or backslash: `toJsx` single-quotes rows. */
export const CHARS = '#abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export const MAX_COLORS = CHARS.length

/** Sets one cell. Returns null when the cell already holds `ch`, so callers can skip the update. */
export function paint(rows: readonly string[], x: number, y: number, ch: string, cols: number): string[] | null {
  const row = (rows[y] ?? '').padEnd(cols, '.')
  if (row[x] === ch) return null
  const next = [...rows]
  next[y] = row.slice(0, x) + ch + row.slice(x + 1)
  return next
}

/** Crops or pads (with '.') to the given size, anchored at the top-left corner. */
export function resize(rows: readonly string[], cols: number, rowCount: number): string[] {
  return Array.from({ length: rowCount }, (_, y) => (rows[y] ?? '').padEnd(cols, '.').slice(0, cols))
}

export const blank = (cols: number, rowCount: number): string[] => resize([], cols, rowCount)

export function nextChar(used: readonly string[]): string | null {
  for (const ch of CHARS) if (!used.includes(ch)) return ch
  return null
}

export type ImportCode = 'read' | 'size' | 'colors'

export class ImportError extends Error {
  code: ImportCode
  info: Record<string, number>
  constructor(code: ImportCode, info: Record<string, number> = {}) {
    super(code)
    this.code = code
    this.info = info
  }
}

const hexOf = (r: number, g: number, b: number) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`

/** Turns RGBA pixels into a drawing: alpha under 128 is transparent, each other color gets the next free character. */
export function fromPixels(data: Uint8ClampedArray, width: number, height: number): Drawing {
  const colors = new Map<string, string>()
  for (let i = 0; i < width * height * 4; i += 4) {
    if (data[i + 3] < 128) continue
    const hex = hexOf(data[i], data[i + 1], data[i + 2])
    if (!colors.has(hex)) colors.set(hex, CHARS[colors.size] ?? '')
  }
  if (colors.size > MAX_COLORS) throw new ImportError('colors', { n: colors.size, max: MAX_COLORS })
  const bitmap: string[] = []
  for (let y = 0; y < height; y++) {
    let row = ''
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      row += data[i + 3] < 128 ? '.' : colors.get(hexOf(data[i], data[i + 1], data[i + 2]))
    }
    bitmap.push(row)
  }
  const palette: Palette = {}
  for (const [hex, ch] of colors) palette[ch] = hex
  return { bitmap, palette }
}

/** Decodes an image file at its natural size (no OS scaling, no color conversion) and converts it. */
export async function importImage(file: File): Promise<Drawing & { width: number; height: number }> {
  let image: ImageBitmap
  try {
    image = await createImageBitmap(file, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })
  } catch {
    throw new ImportError('read')
  }
  const { width, height } = image
  if (width > HARD_MAX_SIDE || height > HARD_MAX_SIDE) {
    image.close()
    throw new ImportError('size', { w: width, h: height, max: HARD_MAX_SIDE })
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0)
  image.close()
  return { ...fromPixels(ctx.getImageData(0, 0, width, height).data, width, height), width, height }
}

/** Resolves any CSS color (a `var(--token)`, a name, an rgb()) to hex, for canvas and the native color input. */
export function toHex(color: string): string | null {
  const probe = document.createElement('span')
  probe.style.color = color
  if (!probe.style.color) return null
  document.body.append(probe)
  const rgb = getComputedStyle(probe).color.match(/\d+/g)
  probe.remove()
  if (!rgb || rgb.length < 3) return null
  return hexOf(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]))
}

/** Draws the bitmap at one canvas pixel per bitmap pixel. Palette colors must be literal: canvas cannot resolve var(). */
export function toCanvas(bitmap: Bitmap, palette: Palette): HTMLCanvasElement {
  const { cols, rows } = bitmapSize(bitmap)
  const canvas = document.createElement('canvas')
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext('2d')!
  for (const run of toRuns(bitmap, palette)) {
    ctx.fillStyle = run.color
    ctx.fillRect(run.x, run.y, run.width, 1)
  }
  return canvas
}

/** Downloads the drawing as a 1x PNG, resolving CSS variables to the colors currently on screen. */
export function exportPng(bitmap: Bitmap, palette: Palette, name = 'glyph.png'): void {
  const literal: Palette = {}
  for (const [ch, color] of Object.entries(palette)) {
    const hex = toHex(color)
    if (hex) literal[ch] = hex
  }
  const link = document.createElement('a')
  link.href = toCanvas(bitmap, literal).toDataURL('image/png')
  link.download = name
  link.click()
}
