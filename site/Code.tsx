import { useState } from 'react'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { CHECK, COPY, MONO } from './bitmaps/glyphs'

export function useCopy(): [copied: boolean, copy: (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false)
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return [copied, copy]
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, copy] = useCopy()
  return (
    <button type="button" className="btn copy" onClick={() => copy(text)}>
      <PixelGlyph bitmap={copied ? CHECK : COPY} palette={MONO} unit="var(--px)" />
      {copied ? 'Copied' : label}
    </button>
  )
}

export function Code({ code }: { code: string }) {
  return (
    <div className="code">
      <pre>
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  )
}
