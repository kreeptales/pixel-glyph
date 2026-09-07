import { useMemo } from 'react'
import { bitmapSize, toRuns, type Bitmap, type Palette } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { BULLET, MONO } from '../bitmaps/glyphs'
import { BitmapText } from '../BitmapText'
import { T, useT, type Key } from '../i18n'
import { HEART } from '../presets'

// Literal colors so the canvas renderer gets the same palette as the other two.
const HEART_HEX: Palette = { '#': '#2a2438', s: '#ff9c8a', c: '#fff6e9' }
const UNIT = 12.5
const BENEFITS: Key[] = ['intro.get.1', 'intro.get.2', 'intro.get.3', 'intro.get.4', 'intro.get.5', 'intro.get.6']

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
  const t = useT()
  return (
    <>
      <section className="hero">
        <h1 className="title">
          <BitmapText text="PIXEL GLYPH" scale={3} />
        </h1>
        <p className="lead">{t('intro.lead')}</p>
        <p>
          <a className="btn" href="#playground">
            {t('intro.open')}
          </a>
        </p>
      </section>

      <h2 className="title">
        <BitmapText text={t('intro.compare.title')} scale={2} />
      </h2>
      <p>{t('intro.compare.text', { unit: UNIT })}</p>
      <div className="compare">
        <div>
          <div className="sample">
            <BoxShadowPixels bitmap={HEART.bitmap} palette={HEART_HEX} unit={UNIT} />
          </div>
          <p className="caption">{t('intro.compare.shadow')}</p>
        </div>
        <div>
          <div className="sample">
            <PngPixels bitmap={HEART.bitmap} palette={HEART_HEX} unit={UNIT} />
          </div>
          <p className="caption">{t('intro.compare.png')}</p>
        </div>
        <div>
          <div className="sample">
            <PixelGlyph bitmap={HEART.bitmap} palette={HEART_HEX} unit={UNIT} label={t('preset.Heart')} />
          </div>
          <p className="caption">{t('intro.compare.svg')}</p>
        </div>
      </div>

      <h2 className="title">
        <BitmapText text={t('intro.get.title')} scale={2} />
      </h2>
      <ul className="list">
        {BENEFITS.map((key) => (
          <li key={key}>
            <PixelGlyph bitmap={BULLET} palette={MONO} unit="var(--px)" />
            <span>
              <T k={key} />
            </span>
          </li>
        ))}
      </ul>

      <h2 className="title">
        <BitmapText text={t('intro.scale.title')} scale={2} />
      </h2>
      <p>{t('intro.scale.text')}</p>
    </>
  )
}
