import { describe, expect, it } from 'vitest'
import { bitmapSize, toRuns } from './bitmap'

const palette = { '#': 'var(--ink)', s: 'var(--salmon)' }
const cross = ['.#.', '#s#', '.#.']

describe('toRuns', () => {
  it('collapses each row into runs of same-colored pixels', () => {
    expect(toRuns(cross, palette)).toEqual([
      { x: 1, y: 0, width: 1, color: 'var(--ink)' },
      { x: 0, y: 1, width: 1, color: 'var(--ink)' },
      { x: 1, y: 1, width: 1, color: 'var(--salmon)' },
      { x: 2, y: 1, width: 1, color: 'var(--ink)' },
      { x: 1, y: 2, width: 1, color: 'var(--ink)' },
    ])
  })

  it('skips transparent and unknown characters', () => {
    expect(toRuns(['###.##', 'x.'], palette)).toEqual([
      { x: 0, y: 0, width: 3, color: 'var(--ink)' },
      { x: 4, y: 0, width: 2, color: 'var(--ink)' },
    ])
  })
})

describe('bitmapSize', () => {
  it('uses the longest row as the width', () => {
    expect(bitmapSize(['##', '####', '#'])).toEqual({ cols: 4, rows: 3 })
    expect(bitmapSize([])).toEqual({ cols: 0, rows: 0 })
  })
})
