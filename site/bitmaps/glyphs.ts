import type { Bitmap, Palette } from '@kreeptales/pixel-glyph'

/** Site logo: a 3x3 mosaic of pixels behind a 1 px ink grid, "a bitmap". */
export const LOGO: Bitmap = [
  '################',
  '#ssss#mmmm#yyyy#',
  '#ssss#mmmm#yyyy#',
  '#ssss#mmmm#yyyy#',
  '#ssss#mmmm#yyyy#',
  '################',
  '#kkkk#cccc#ssss#',
  '#kkkk#cccc#ssss#',
  '#kkkk#cccc#ssss#',
  '#kkkk#cccc#ssss#',
  '################',
  '#mmmm#yyyy#kkkk#',
  '#mmmm#yyyy#kkkk#',
  '#mmmm#yyyy#kkkk#',
  '#mmmm#yyyy#kkkk#',
  '################',
]

export const LOGO_PALETTE: Palette = {
  '#': 'var(--ink)',
  s: 'var(--salmon)',
  m: 'var(--mint)',
  y: 'var(--sun)',
  k: 'var(--sky)',
  c: 'var(--cream)',
}

/** Literal colors for places without CSS variables (the favicon data URL). */
export const LOGO_HEX: Palette = {
  '#': '#2a2438',
  s: '#ff9c8a',
  m: '#8fe3c0',
  y: '#ffd86b',
  k: '#7fc8f0',
  c: '#fff6e9',
}

/** Single-color glyphs follow the text color. */
export const MONO: Palette = { '#': 'currentColor' }

export const COPY: Bitmap = [
  '.#####..',
  '.#...#..',
  '.#.#####',
  '.#.#...#',
  '.###...#',
  '...#...#',
  '...#...#',
  '...#####',
]

export const CHECK: Bitmap = [
  '........',
  '.......#',
  '......##',
  '#....##.',
  '##..##..',
  '.####...',
  '..##....',
  '........',
]

export const SUN: Bitmap = [
  '...#....',
  '.#...#..',
  '..###...',
  '#.###.#.',
  '..###...',
  '.#...#..',
  '...#....',
  '........',
]

export const MOON: Bitmap = [
  '..###...',
  '.##.....',
  '##......',
  '##......',
  '##......',
  '.##.....',
  '..###...',
  '........',
]

export const BULLET: Bitmap = [
  '........',
  '..#.....',
  '..##....',
  '..###...',
  '..####..',
  '..###...',
  '..##....',
  '..#.....',
]

export const LINK: Bitmap = [
  '........',
  '...####.',
  '.....##.',
  '....#.#.',
  '...#..#.',
  '..#.....',
  '.#......',
  '........',
]

/** Pip, the site's mascot: a mint slime with two frames (idle, blink). */
const PIP_BODY = (eyes: [string, string]): Bitmap => [
  '.....######.....',
  '...##mmmmmm##...',
  '..#mmmmmmmmmm#..',
  '.#mmmmmmmmmmmm#.',
  '.#mmmmmmmmmmmm#.',
  `.#mm${eyes[0]}mmmm${eyes[0]}mm#.`,
  `.#mm${eyes[1]}mmmm${eyes[1]}mm#.`,
  '.#mmmmmmmmmmmm#.',
  '.#sMmmmmmmmmmMs#',
  '.#mmmm#mmm#mmmm#',
  '.#mmmmm###mmmmm#',
  '..#MMMMMMMMMMM#.',
  '...##MMMMMMM##..',
  '.....######.....',
]

export const PIP: { idle: Bitmap; blink: Bitmap } = {
  idle: PIP_BODY(['##', '##']),
  blink: PIP_BODY(['mm', '##']),
}

export const PIP_PALETTE: Palette = {
  '#': 'var(--ink)',
  m: 'var(--mint)',
  M: 'var(--mint-2)',
  s: 'var(--salmon)',
}
