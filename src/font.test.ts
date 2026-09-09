import { describe, expect, it } from 'vitest'
import { bitmapSize } from './bitmap'
import { FONT, FONT_HEIGHT, textToBitmap } from './font'

describe('FONT', () => {
  it('has glyphs of the right height with even rows', () => {
    for (const [ch, glyph] of Object.entries(FONT)) {
      expect(glyph, ch).toHaveLength(FONT_HEIGHT)
      expect(new Set(glyph.map((row) => row.length)).size, ch).toBe(1)
    }
  })
})

describe('textToBitmap', () => {
  it('lays glyphs side by side with a one-pixel gap', () => {
    const bitmap = textToBitmap('HI')
    expect(bitmap).toHaveLength(FONT_HEIGHT)
    expect(bitmapSize(bitmap).cols).toBe(5 + 1 + 3)
    expect(bitmap[0]).toBe('#...#.###')
  })

  it('accepts a different gap', () => {
    expect(bitmapSize(textToBitmap('HI', { gap: 0 })).cols).toBe(8)
    expect(bitmapSize(textToBitmap('HI', { gap: 3 })).cols).toBe(11)
  })

  it('uppercases, keeps the eñe and drops accents', () => {
    expect(textToBitmap('ñandú')).toEqual(textToBitmap('ÑANDU'))
    expect(textToBitmap('é')).toEqual(textToBitmap('E'))
  })

  it('falls back to the question mark for unknown characters', () => {
    expect(textToBitmap('~')).toEqual(textToBitmap('?'))
  })

  it('renders empty text as empty rows', () => {
    expect(textToBitmap('')).toEqual(Array(FONT_HEIGHT).fill(''))
    expect(bitmapSize(textToBitmap(''))).toEqual({ cols: 0, rows: FONT_HEIGHT })
  })
})
