import { bitmapSize, toRuns, type Bitmap, type Palette } from './bitmap'
import { BASE_STYLE, sizeStyle, type Unit } from './unit'

export type SvgOptions = {
  /** Size of one pixel; default `1` (px). Use `"var(--px)"` to size from CSS. */
  unit?: Unit
  /** When given, the glyph is exposed as an image with this name. */
  label?: string
}

function escapeAttr(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * The same markup `<PixelGlyph>` renders, as a string: for plain HTML, Vue,
 * Svelte, server templates or an `<img src="data:...">`.
 */
export function toSvg(bitmap: Bitmap, palette: Palette, { unit = 1, label }: SvgOptions = {}): string {
  const { cols, rows } = bitmapSize(bitmap)
  const style = Object.entries({ ...BASE_STYLE, ...sizeStyle(cols, rows, unit) })
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  const a11y = label ? ` role="img" aria-label="${escapeAttr(label)}"` : ' aria-hidden="true"'
  const title = label ? `<title>${escapeAttr(label)}</title>` : ''
  const rects = toRuns(bitmap, palette)
    .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="1" style="fill:${escapeAttr(r.color)}"/>`)
    .join('')
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges"` +
    ` style="${style}"${a11y}>${title}${rects}</svg>`
  )
}
