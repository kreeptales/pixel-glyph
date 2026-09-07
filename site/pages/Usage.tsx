import type { CSSProperties } from 'react'
import { toSvg } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { BitmapText } from '../BitmapText'
import { Code } from '../Code'
import { T, useT } from '../i18n'

const palette = { '#': 'var(--ink)', r: 'var(--salmon)' }
const cross = ['.#.', '#r#', '.#.']

export function Usage() {
  const t = useT()
  return (
    <>
      <h2 className="title">
        <BitmapText text={t('usage.react.title')} scale={2} />
      </h2>
      <div className="example">
        <Code
          code={`import { PixelGlyph } from '@kreeptales/pixel-glyph/react'

const palette = { '#': 'var(--ink)', r: 'var(--salmon)' }
const cross = ['.#.', '#r#', '.#.']

<PixelGlyph bitmap={cross} palette={palette} unit={8} label="Close" />`}
        />
        <div className="sample">
          <PixelGlyph bitmap={cross} palette={palette} unit={8} label="Close" />
        </div>
      </div>
      <p>
        <T k="usage.react.text" />
      </p>

      <h2 className="title">
        <BitmapText text={t('usage.core.title')} scale={2} />
      </h2>
      <div className="example">
        <Code
          code={`import { toSvg } from '@kreeptales/pixel-glyph'

element.innerHTML = toSvg(cross, palette, { unit: 8, label: 'Close' })`}
        />
        <div className="sample" dangerouslySetInnerHTML={{ __html: toSvg(cross, palette, { unit: 8, label: 'Close' }) }} />
      </div>
      <p>
        <T k="usage.core.text" />
      </p>

      <h2 className="title">
        <BitmapText text={t('usage.unit.title')} scale={2} />
      </h2>
      <div className="example">
        <Code
          code={`:root { --px: 2px; }

<PixelGlyph bitmap={cross} palette={palette} unit="var(--px)" />

/* One glyph, a different size: the calc resolves against its own --px */
.big { --px: 6px; }`}
        />
        <div className="sample">
          <PixelGlyph bitmap={cross} palette={palette} unit="var(--px)" />
          <PixelGlyph
            bitmap={cross}
            palette={palette}
            unit="var(--px)"
            style={{ '--px': 'calc(3 * var(--px))', marginLeft: 16 } as CSSProperties}
          />
        </div>
      </div>
      <p>
        <T k="usage.unit.text" />
      </p>

      <h2 className="title">
        <BitmapText text={t('usage.palette.title')} scale={2} />
      </h2>
      <div className="example">
        <Code
          code={`const themed = { '#': 'var(--fg)', r: 'var(--accent)' }

<PixelGlyph bitmap={cross} palette={themed} unit={8} />`}
        />
        <div className="sample themed">
          <PixelGlyph bitmap={cross} palette={{ '#': 'var(--fg)', r: 'var(--accent)' }} unit={8} />
        </div>
      </div>
      <p>
        <T k="usage.palette.text" />
      </p>
    </>
  )
}
