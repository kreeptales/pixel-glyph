import { BitmapText } from '../BitmapText'
import { Code } from '../Code'

export function Install() {
  return (
    <>
      <h2 className="title">
        <BitmapText text="INSTALL" scale={2} />
      </h2>
      <Code code="npm install @kreeptales/pixel-glyph" />
      <p>Two entry points. The core has no dependencies; the React entry needs React 18 or newer as a peer.</p>
      <Code
        code={`import { toSvg, toRuns, bitmapSize } from '@kreeptales/pixel-glyph'
import type { Bitmap, Palette } from '@kreeptales/pixel-glyph'

import { PixelGlyph } from '@kreeptales/pixel-glyph/react'`}
      />
      <p className="muted">ES modules with TypeScript declarations. The package ships dist/ only, about 1 kB gzipped per entry.</p>
    </>
  )
}
