import { useMemo } from 'react'
import { bitmapSize, toRuns, type Bitmap, type Palette } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { BULLET, MONO } from '../bitmaps/glyphs'
import { BitmapText } from '../BitmapText'
import { HEART } from '../presets'

// Literal colors so the canvas renderer gets the same palette as the other two.
const HEART_HEX: Palette = { '#': '#2a2438', s: '#ff9c8a', c: '#fff6e9' }
const UNIT = 12.5

/** One box-shadow per pixel: the classic CSS trick, and where the seams come from. */
function BoxShadowPixels({ bitmap, palette, unit }: { bitmap: Bitmap; palette: Palette; unit: number }) {
  const { cols, rows } = bitmapSize(bitmap)
  const shadows = toRuns(bitmap, palette).flatMap((run) =>
    Array.from({ length: run.width }, (_, i) => `${(run.x + i) * unit}px ${run.y * unit}px 0 ${run.color}`),
  )
  return (
    <div style={{ width: cols * unit, height: rows * unit }} aria-hidden="true">
      <div style={{ width: unit, height: unit, boxShadow: shadows.join(',') }} />
    </div>
  )
}

/** A 1x PNG drawn on a canvas, then upscaled with image-rendering: pixelated. */
function PngPixels({ bitmap, palette, unit }: { bitmap: Bitmap; palette: Palette; unit: number }) {
  const { cols, rows } = bitmapSize(bitmap)
  const src = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = cols
    canvas.height = rows
    const ctx = canvas.getContext('2d')!
    for (const run of toRuns(bitmap, palette)) {
      ctx.fillStyle = run.color
      ctx.fillRect(run.x, run.y, run.width, 1)
    }
    return canvas.toDataURL()
  }, [bitmap, palette, cols, rows])
  return <img src={src} alt="" width={cols * unit} height={rows * unit} style={{ imageRendering: 'pixelated' }} />
}

export function Intro() {
  return (
    <>
      <section className="hero">
        <h1 className="title">
          <BitmapText text="PIXEL GLYPH" scale={3} />
        </h1>
        <p className="lead">
          Draw a sprite as text. Get an SVG that stays sharp at any scale, with colors that follow your CSS variables.
        </p>
        <p>
          <a className="btn" href="#playground">
            Open the playground
          </a>
        </p>
      </section>

      <h2 className="title">
        <BitmapText text="SAME BITMAP, THREE RENDERERS" scale={2} />
      </h2>
      <p>
        The heart below is drawn three ways at {UNIT} CSS pixels per bitmap pixel, a fractional size on purpose. Zoom
        your browser to 90% or 110% and look at the edges and the gaps between pixels.
      </p>
      <div className="compare">
        <div>
          <div className="sample">
            <BoxShadowPixels bitmap={HEART.bitmap} palette={HEART_HEX} unit={UNIT} />
          </div>
          <p className="caption">box-shadow per pixel. Hairline seams appear wherever an edge lands between device pixels.</p>
        </div>
        <div>
          <div className="sample">
            <PngPixels bitmap={HEART.bitmap} palette={HEART_HEX} unit={UNIT} />
          </div>
          <p className="caption">PNG with image-rendering: pixelated. Uneven pixel widths and no CSS colors.</p>
        </div>
        <div>
          <div className="sample">
            <PixelGlyph bitmap={HEART.bitmap} palette={HEART_HEX} unit={UNIT} label="Heart" />
          </div>
          <p className="caption">PixelGlyph: SVG rects with crispEdges. Every rect snaps to whole device pixels, no seams.</p>
        </div>
      </div>

      <h2 className="title">
        <BitmapText text="WHAT YOU GET" scale={2} />
      </h2>
      <ul className="list">
        {[
          'No seams and no blur at fractional device scales: browser zoom, 125% laptops, retina.',
          'Palettes are CSS: a character maps to any color, var(--token) included. Switch the theme in the header.',
          'One rect per horizontal run, not one per pixel. A 16x16 icon is a few dozen rects.',
          'A framework-free core (toSvg, toRuns) and a React component with the same output.',
          'Bitmaps live in code: versioned, diffable, reviewable, and copied around as strings.',
          'Zero dependencies. React is an optional peer.',
        ].map((line) => (
          <li key={line}>
            <PixelGlyph bitmap={BULLET} palette={MONO} unit="var(--px)" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <h2 className="title">
        <BitmapText text="SEE IT SCALE" scale={2} />
      </h2>
      <p>
        Change the scale in the header. The whole site, titles included, is sized from one CSS variable, and every
        glyph stays crisp because it is a PixelGlyph. That is the entire trick.
      </p>
    </>
  )
}
