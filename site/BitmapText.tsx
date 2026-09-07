import type { Bitmap } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { FONT, FONT_HEIGHT } from './bitmaps/font'

/** Composes the letters of `text` into one bitmap with a one-pixel gap between them. */
export function textToBitmap(text: string): Bitmap {
  const glyphs = [...text.toUpperCase()].map((ch) => FONT[ch] ?? FONT['?'])
  return Array.from({ length: FONT_HEIGHT }, (_, y) => glyphs.map((glyph) => glyph[y]).join('.'))
}

type Props = {
  text: string
  /** Multiplier over the page pixel unit; titles use 2 or 3. */
  scale?: number
  color?: string
  className?: string
}

/** A title drawn as a glyph: it scales with --px like every icon on the page. */
export function BitmapText({ text, scale = 1, color = 'var(--fg)', className }: Props) {
  return (
    <PixelGlyph
      bitmap={textToBitmap(text)}
      palette={{ '#': color }}
      unit={`calc(${scale} * var(--px))`}
      label={text}
      className={className}
    />
  )
}
