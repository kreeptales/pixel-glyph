# @kreeptales/pixel-glyph

[![CI](https://github.com/kreeptales/pixel-glyph/actions/workflows/ci.yml/badge.svg)](https://github.com/kreeptales/pixel-glyph/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40kreeptales%2Fpixel-glyph)](https://www.npmjs.com/package/@kreeptales/pixel-glyph)

Write a sprite as lines of text and get an SVG that stays sharp at any size,
even when one bitmap pixel does not map to a whole number of screen pixels.
Colors can come from CSS variables, so a glyph follows your theme.

**Docs and playground:** https://kreeptales-pixel-glyph.evilld94.workers.dev/
The site is available in English and Spanish (EN/ES button in the header).

A bitmap is an array of strings. A dot is an empty pixel and any other
character is a painted pixel whose color you choose in a palette:

```ts
const heart = [
  '.##.##.',
  '#######',
  '#######',
  '.#####.',
  '..###..',
  '...#...',
]
```

The package has no dependencies. It ships a core that works without any
framework and a React component built on top of it.

## Screenshots

The docs site is drawn with the library itself. Every image on it, titles
included, is a `PixelGlyph`.

| Intro: the same heart as box-shadow, PNG and PixelGlyph | Playground: edit, preview, copy, share |
| --- | --- |
| ![Intro page](docs/screenshots/intro.png) | ![Playground](docs/screenshots/playground.png) |

<img src="docs/screenshots/mobile.png" alt="The intro page on a phone, light theme" width="260">

## The problem

There are three common ways to put pixel art on a web page, and each one has
a catch:

- A PNG with `image-rendering: pixelated` looks fine at 100%, but as soon as
  the browser zoom or the display scale is not a whole number (80% zoom, a
  laptop at 125%), some pixels come out wider than others. Its colors are also
  fixed in the file.
- One `box-shadow` per pixel gives you CSS colors, but at those same scales thin
  lines appear between pixels wherever an edge falls between two screen pixels.
- Icon fonts and hand-drawn SVG paths scale well, but they are no longer pixel
  art.

This library turns the bitmap into an SVG made of rectangles, one for each
horizontal run of same-colored pixels, and turns antialiasing off with
`shape-rendering: crispEdges`. Each rectangle then lands on whole screen
pixels, so there are no gaps and no blur, the same way a pixel game scales
its sprites. Colors are written as inline styles, so a palette entry can be
`var(--ink)` and the glyph changes with your theme.

## Install

```bash
npm install @kreeptales/pixel-glyph
```

React 18 or newer is needed only if you use the `/react` entry. It is declared
as an optional peer dependency.

## Usage

### React

```tsx
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'

const palette = { '#': 'var(--ink)', r: '#e07a5f' }
const cross = ['.#.', '#r#', '.#.']

<PixelGlyph bitmap={cross} palette={palette} unit={4} label="Close" />
```

Props:

| Prop        | Type                        | Default | Notes                                                        |
| ----------- | --------------------------- | ------- | ------------------------------------------------------------ |
| `bitmap`    | `readonly string[]`         |         | One string per row, one character per pixel, `.` is transparent. |
| `palette`   | `Record<string, string>`    |         | Character to CSS color. Characters not in the palette are skipped. |
| `unit`      | `number \| string`          | `1`     | Size of one pixel. A number is px; a string is used as written, e.g. `"var(--px)"`. |
| `label`     | `string`                    |         | When set, the SVG is `role="img"` with this name and a `<title>`. Otherwise it is `aria-hidden`. |
| `className` | `string`                    |         |                                                              |
| `style`     | `CSSProperties`             |         | Merged after the base styles, so it can override them.       |

### Core, without a framework

```ts
import { toSvg } from '@kreeptales/pixel-glyph'

element.innerHTML = toSvg(cross, palette, { unit: 4, label: 'Close' })
```

`toSvg` returns the same markup the React component renders, as a string, so
it works in plain HTML, Vue, Svelte, a server template or an image data URL.
If you would rather draw the pixels yourself, on a canvas for example,
`toRuns(bitmap, palette)` gives you the list of rectangles, and
`bitmapSize(bitmap)` returns `{ cols, rows }`.

### One pixel size for the whole interface

The `unit` is the size of one bitmap pixel. A number means CSS pixels. A string
is used as written, so you can point every glyph at one CSS variable and change
the size of the whole interface in one place:

```css
:root { --px: 2px; }
@media (max-width: 1400px) { :root { --px: 1.75px; } }
```

```tsx
<PixelGlyph bitmap={icon} palette={palette} unit="var(--px)" />
```

To give one glyph a different size, set the variable on that glyph through
`className` or `style`. The SVG reads its own `--px`.

### Palettes are CSS

A palette value is any CSS color, and it is applied as an inline style on each
rectangle, so `var(--token)` is resolved where the glyph appears. Change the
variables and the colors change; the bitmap stays the same. `currentColor`
works too, for icons that should match the text around them.

### Bitmap font

The package ships a 5x7 dot-matrix font, so a heading can be a glyph too and
scale with the same `unit` as your icons:

```tsx
import { textToBitmap } from '@kreeptales/pixel-glyph/font'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'

<PixelGlyph bitmap={textToBitmap('Hello')} palette={{ '#': 'currentColor' }} unit={3} label="Hello" />
```

`textToBitmap(text, { gap })` draws capital letters, the eñe, digits and basic
punctuation, one pixel apart by default. Lowercase becomes capitals and accents
are dropped, because a 7-row cell has no room for them, so pass the original
text as the `label`. `FONT` exposes the glyphs and `FONT_HEIGHT` their height.

## Notes

- The SVG is `display: inline-block` with the default baseline alignment, so it
  sits in a line of text or inside a button like an inline image would.
- The SVG has `overflow: visible`, so a bitmap can draw outside its own box.
  This is useful for overlays such as a hat that is wider than the head it sits
  on.
- Rows can have different lengths. The width of the glyph is the longest row.
- Neighboring pixels of the same color become one rectangle, so a 16x16 icon
  is usually 20 to 40 rectangles instead of 256.

## Built with pixel-glyph

- [RunenBow](https://runenbow.com/), a portfolio shaped like a retro desktop
  OS. Its icons, logo and mascot are bitmaps drawn by this library, which
  started as part of that project.
- [The docs site](https://kreeptales-pixel-glyph.evilld94.workers.dev/) of this
  package: logo, icons, page titles (a 5x7 bitmap font) and the mascot.

## Development

```bash
npm test          # vitest
npm run lint      # oxlint
npm run build     # dist/ (ES modules + declarations)
npm run site:dev  # docs site with the playground, served from src/
bash scripts/screenshots.sh   # refresh docs/screenshots from the deployed site
```

## Contributing

Issues and pull requests are welcome. [CONTRIBUTING.md](CONTRIBUTING.md)
has the setup, the layout and the rules the project follows; security
problems go through [SECURITY.md](SECURITY.md).

## License

MIT
