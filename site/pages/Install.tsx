import { BitmapText } from '../BitmapText'
import { Code } from '../Code'
import { useT } from '../i18n'

export function Install() {
  const t = useT()
  return (
    <>
      <h2 className="title">
        <BitmapText text={t('install.title')} scale={2} />
      </h2>
      <Code code="npm install @kreeptales/pixel-glyph" />
      <p>{t('install.text')}</p>
      <Code
        code={`import { toSvg, toRuns, bitmapSize } from '@kreeptales/pixel-glyph'
import type { Bitmap, Palette } from '@kreeptales/pixel-glyph'

import { PixelGlyph } from '@kreeptales/pixel-glyph/react'`}
      />
      <p className="muted">{t('install.note')}</p>
    </>
  )
}
