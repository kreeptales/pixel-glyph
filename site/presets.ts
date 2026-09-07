import type { Bitmap, Palette } from '@kreeptales/pixel-glyph'

export type Drawing = { bitmap: Bitmap; palette: Palette }

/** RunenBow's runic "R": the logo this library was extracted with. */
const RUNE: Drawing = {
  bitmap: [
    '................',
    '..######........',
    '..#ssss##.......',
    '..#ss#ss##......',
    '..#ss##ss##.....',
    '..#ss###ss##....',
    '..#ss####ss##...',
    '..#sssssssss#...',
    '..#sssssssss#...',
    '..#ss##ss####...',
    '..#ss###ss##....',
    '..#ss#.##ss##...',
    '..#ss#..##ss##..',
    '..#ss#...##ss#..',
    '..####....####..',
    '................',
  ],
  palette: { '#': 'var(--ink)', s: 'var(--salmon)' },
}

/** Flopi, RunenBow's mascot: a 3.5" floppy with a face. */
const FLOPI: Drawing = {
  bitmap: [
    '.##############.',
    '#lll#kkkkkk#lll#',
    '#lll#kk##kk#lll#',
    '#lll#kk##kk#lll#',
    '#lll########lll#',
    '#lllllllllllllL#',
    '#l############L#',
    '#l#cccccccccc#L#',
    '#l#c##cccc##c#L#',
    '#l#c##cccc##c#L#',
    '#l#sccccccccs#L#',
    '#l#cc#cccc#cc#L#',
    '#l#ccc####ccc#L#',
    '#l############L#',
    '#LLLLLLLLLLLLLL#',
    '.##############.',
  ],
  palette: {
    '#': 'var(--ink)',
    l: 'var(--lavender)',
    L: 'var(--lavender-2)',
    k: 'var(--sky)',
    c: 'var(--cream)',
    s: 'var(--salmon)',
  },
}

export const HEART: Drawing = {
  bitmap: [
    '..##...##..',
    '.#ss#.#ss#.',
    '#sccs#ssss#',
    '#scsssssss#',
    '#sssssssss#',
    '.#sssssss#.',
    '..#sssss#..',
    '...#sss#...',
    '....#s#....',
    '.....#.....',
  ],
  palette: { '#': 'var(--ink)', s: 'var(--salmon)', c: 'var(--cream)' },
}

export const PRESETS: Record<string, Drawing> = { Rune: RUNE, Flopi: FLOPI, Heart: HEART }
