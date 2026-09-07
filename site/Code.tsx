import { useState, type ReactNode } from 'react'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { CHECK, COPY, MONO } from './bitmaps/glyphs'
import { useT } from './i18n'

export function useCopy(): [copied: boolean, copy: (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false)
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return [copied, copy]
}

export function CopyButton({ text }: { text: string }) {
  const t = useT()
  const [copied, copy] = useCopy()
  return (
    <button type="button" className="btn copy" onClick={() => copy(text)}>
      <PixelGlyph bitmap={copied ? CHECK : COPY} palette={MONO} unit="var(--px)" />
      {copied ? t('copied') : t('copy')}
    </button>
  )
}

export function Code({ code, toolbar }: { code: string; toolbar?: ReactNode }) {
  return (
    <div className="code">
      <div className="code-bar">
        {toolbar}
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
