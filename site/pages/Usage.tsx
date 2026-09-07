import type { CSSProperties } from 'react'
import { toSvg } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { BitmapText } from '../BitmapText'
import { Code } from '../Code'

const palette = { '#': 'var(--ink)', r: 'var(--salmon)' }
const cross = ['.#.', '#r#', '.#.']

export function Usage() {
  return (
    <>
      <h2 className="title">
        <BitmapText text="REACT" scale={2} />
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
        Without a label the SVG is hidden from assistive technology. With one it becomes an image with that name.
        <code> className</code> and <code>style</code> are passed through.
      </p>

      <h2 className="title">
        <BitmapText text="CORE, NO FRAMEWORK" scale={2} />
      </h2>
      <div className="example">
        <Code
          code={`import { toSvg } from '@kreeptales/pixel-glyph'

element.innerHTML = toSvg(cross, palette, { unit: 8, label: 'Close' })`}
        />
        <div className="sample" dangerouslySetInnerHTML={{ __html: toSvg(cross, palette, { unit: 8, label: 'Close' }) }} />
      </div>
      <p>
        The same markup the component renders, as a string: plain HTML, Vue, Svelte, server templates or an image
        data URL. <code>toRuns</code> gives you the rectangles if you want to draw them yourself.
      </p>

      <h2 className="title">
        <BitmapText text="ONE UNIT FOR THE WHOLE UI" scale={2} />
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
          <PixelGlyph bitmap={cross} palette={palette} unit="var(--px)" style={{ '--px': 'calc(3 * var(--px))', marginLeft: 16 } as CSSProperties} />
        </div>
      </div>
      <p>
        A string unit is used as written and the glyph is sized with <code>calc(cols * unit)</code>. This site and
        RunenBow size everything from one <code>--px</code>, which is what the scale selector in the header changes.
      </p>

      <h2 className="title">
        <BitmapText text="PALETTES ARE CSS" scale={2} />
      </h2>
      <div className="example">
        <Code
          code={`const themed = { '#': 'var(--fg)', r: 'var(--accent)' }

<PixelGlyph bitmap={cross} palette={themed} unit={8} />`}
        />
        <div className="sample">
          <PixelGlyph bitmap={cross} palette={{ '#': 'var(--fg)', r: 'var(--accent)' }} unit={8} />
        </div>
      </div>
      <p>
        Fills go through <code>style</code>, so variables resolve where the glyph is rendered. Toggle the theme in the
        header: the bitmap stays, the colors follow. <code>currentColor</code> works too, for icons that follow text.
      </p>
    </>
  )
}
