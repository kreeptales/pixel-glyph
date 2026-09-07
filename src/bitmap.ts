/** Rows of characters; each character is one pixel. '.' is transparent. */
export type Bitmap = readonly string[]
/** Maps a bitmap character to a CSS color: a literal or a `var(--token)`. */
export type Palette = Record<string, string>

/** One horizontal run of same-colored pixels, in bitmap units. */
export type Run = { x: number; y: number; width: number; color: string }

/** Width is the longest row, so ragged bitmaps are accepted. */
export function bitmapSize(bitmap: Bitmap): { cols: number; rows: number } {
  return { cols: Math.max(0, ...bitmap.map((row) => row.length)), rows: bitmap.length }
}

/**
 * Collapses each row into runs of adjacent same-colored pixels: one SVG rect
 * per run instead of one per pixel. '.' and characters missing from the
 * palette are skipped.
 */
export function toRuns(bitmap: Bitmap, palette: Palette): Run[] {
  const runs: Run[] = []
  bitmap.forEach((row, y) => {
    let current: Run | null = null
    for (let x = 0; x < row.length; x++) {
      const color = row[x] === '.' ? undefined : palette[row[x]]
      if (color && current && current.color === color) {
        current.width++
        continue
      }
      current = color ? { x, y, width: 1, color } : null
      if (current) runs.push(current)
    }
  })
  return runs
}
