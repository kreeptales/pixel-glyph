import type { CSSProperties } from 'react'
import { bitmapSize, toRuns, type Bitmap, type Palette } from './bitmap'
import { BASE_STYLE, sizeStyle, type Unit } from './unit'

export type PixelGlyphProps = {
  bitmap: Bitmap
  palette: Palette
  /** Size of one pixel; default `1` (px). Use `"var(--px)"` to size from CSS. */
  unit?: Unit
  /** When given, the glyph is exposed as an image with this name. */
  label?: string
  className?: string
  style?: CSSProperties
}

/**
 * Draws a bitmap as an SVG of unit rects. `crispEdges` turns antialiasing
 * off, so at a fractional device scale (browser zoom 80%, a 125% laptop)
 * every rect snaps to whole device pixels: no seams and no blur, the way a
 * pixel game scales its sprites.
 */
export function PixelGlyph({ bitmap, palette, unit = 1, label, className, style }: PixelGlyphProps) {
  const { cols, rows } = bitmapSize(bitmap)
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }

  return (
    <svg
      className={className}
      style={{ ...BASE_STYLE, ...sizeStyle(cols, rows, unit), ...style }}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      {...a11y}
    >
      {label && <title>{label}</title>}
      {toRuns(bitmap, palette).map((run) => (
        <rect key={`${run.x},${run.y}`} x={run.x} y={run.y} width={run.width} height={1} style={{ fill: run.color }} />
      ))}
    </svg>
  )
}
