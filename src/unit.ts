/**
 * The CSS length of one bitmap pixel. A number is taken as px; a string is
 * used as written, so `"var(--px)"` sizes the glyph from a CSS variable.
 */
export type Unit = number | string

export function cssUnit(unit: Unit): string {
  return typeof unit === 'number' ? `${unit}px` : unit
}

/** Inline base styles: inline-block keeps baseline alignment; overflow lets rects wider than the box show. */
export const BASE_STYLE = { display: 'inline-block', flex: 'none', overflow: 'visible' } as const

/** Numeric units multiply out to plain px; string units go through calc() so CSS variables resolve. */
export function sizeStyle(cols: number, rows: number, unit: Unit): { width: string; height: string } {
  const size = (n: number) => (typeof unit === 'number' ? `${n * unit}px` : `calc(${n} * ${unit})`)
  return { width: size(cols), height: size(rows) }
}
