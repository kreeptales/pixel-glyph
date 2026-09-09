import { describe, expect, it } from 'vitest'
import { fromPixels, ImportError, MAX_COLORS, nextChar, paint, resize } from './editing'

describe('paint', () => {
  it('sets one cell and pads short rows', () => {
    expect(paint(['..', '.'], 1, 1, '#', 2)).toEqual(['..', '.#'])
  })

  it('returns null when the cell already holds the character', () => {
    expect(paint(['.#'], 1, 0, '#', 2)).toBeNull()
  })
})

describe('resize', () => {
  it('pads with dots and crops, anchored top-left', () => {
    expect(resize(['##', '##'], 3, 3)).toEqual(['##.', '##.', '...'])
    expect(resize(['###', '###', '###'], 2, 1)).toEqual(['##'])
  })
})

describe('nextChar', () => {
  it('hands out the first free character', () => {
    expect(nextChar([])).toBe('#')
    expect(nextChar(['#', 'a'])).toBe('b')
  })
})

describe('fromPixels', () => {
  it('maps opaque colors to characters in order and alpha under 128 to a dot', () => {
    // 2x2: red, red, half-transparent blue, fully transparent
    const data = new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 255, 0, 0, 255, 200, 0, 0, 0, 0])
    expect(fromPixels(data, 2, 2)).toEqual({ bitmap: ['##', 'a.'], palette: { '#': '#ff0000', a: '#0000ff' } })
  })

  it('refuses images with more colors than characters', () => {
    const n = MAX_COLORS + 1
    const data = new Uint8ClampedArray(n * 4)
    for (let i = 0; i < n; i++) data.set([i, 0, 0, 255], i * 4)
    expect(() => fromPixels(data, n, 1)).toThrow(ImportError)
  })
})
