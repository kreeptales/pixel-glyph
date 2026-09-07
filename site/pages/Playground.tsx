import { useEffect, useMemo, useState } from 'react'
import { bitmapSize, toRuns, toSvg, type Palette } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { BitmapText } from '../BitmapText'
import { Code } from '../Code'
import { T, useT, type Key } from '../i18n'
import { PRESETS, type Drawing } from '../presets'
import { readShared, writeShared } from '../share'

/** Resolves any CSS color (a `var(--token)`, a name, an rgb()) to the hex the native color input needs. */
function toHex(color: string): string | null {
  const probe = document.createElement('span')
  probe.style.color = color
  if (!probe.style.color) return null
  document.body.append(probe)
  const rgb = getComputedStyle(probe).color.match(/\d+/g)
  probe.remove()
  if (!rgb || rgb.length < 3) return null
  return `#${rgb.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`
}

function toJsx(rows: readonly string[], palette: Palette, unit: number): string {
  return `import { PixelGlyph } from '@kreeptales/pixel-glyph/react'

const bitmap = [
${rows.map((row) => `  '${row}',`).join('\n')}
]
const palette = ${JSON.stringify(palette, null, 2)}

<PixelGlyph bitmap={bitmap} palette={palette} unit={${unit}} />`
}

export function Playground() {
  const t = useT()
  const [initial] = useState<Drawing>(() => readShared() ?? PRESETS.Rune)
  const [text, setText] = useState(initial.bitmap.join('\n'))
  const [palette, setPalette] = useState<Palette>(initial.palette)
  const [unit, setUnit] = useState(6)
  const [tab, setTab] = useState<'jsx' | 'svg'>('jsx')
  const copyLink = useCopyLink()

  const rows = useMemo(() => text.split('\n'), [text])
  const chars = useMemo(() => [...new Set(text.replace(/[.\n]/g, ''))], [text])
  const { cols, rows: rowCount } = bitmapSize(rows)
  const runs = toRuns(rows, palette)
  const painted = chars.reduce((n, ch) => (palette[ch] ? n + (text.split(ch).length - 1) : n), 0)
  const missing = chars.filter((ch) => !palette[ch])

  useEffect(() => {
    writeShared({ bitmap: rows, palette })
  }, [rows, palette])

  const load = (drawing: Drawing) => {
    setText(drawing.bitmap.join('\n'))
    setPalette(drawing.palette)
  }
  const setColor = (ch: string, color: string) => setPalette((p) => ({ ...p, [ch]: color }))

  return (
    <>
      <h2 className="title">
        <BitmapText text={t('playground.title')} scale={2} />
      </h2>
      <p>
        <T k="playground.text" />
      </p>

      <div className="playground">
        <div>
          <div className="row">
            <label htmlFor="bitmap">{t('playground.bitmap')}</label>
            {Object.entries(PRESETS).map(([name, drawing]) => (
              <button key={name} type="button" className="btn" onClick={() => load(drawing)}>
                {t(`preset.${name}` as Key)}
              </button>
            ))}
          </div>
          <textarea
            id="bitmap"
            className="field bitmap"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />

          <div className="row">
            <label>{t('playground.palette')}</label>
            {missing.length > 0 && (
              <span className="muted">{t('playground.missing', { chars: missing.map((ch) => `'${ch}'`).join(' ') })}</span>
            )}
          </div>
          <div className="palette">
            {chars.map((ch) => (
              <PaletteRow key={ch} ch={ch} value={palette[ch] ?? ''} onChange={(color) => setColor(ch, color)} />
            ))}
          </div>
        </div>

        <div>
          <div className="row">
            <label htmlFor="unit">
              {t('playground.unit', { unit })}{' '}
              <span className="muted">{t('playground.devicePx', { n: +(unit * devicePixelRatio).toFixed(2) })}</span>
            </label>
          </div>
          <div className="row">
            <input
              id="unit"
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={unit}
              onChange={(e) => setUnit(Number(e.target.value))}
            />
          </div>
          <div className="preview">
            <PixelGlyph bitmap={rows} palette={palette} unit={unit} label={t('playground.preview')} />
          </div>
          <div className="stats">
            <span>
              {cols} x {rowCount}
            </span>
            <span>{t('playground.painted', { n: painted })}</span>
            <span>{t('playground.rects', { n: runs.length, p: painted ? Math.round((1 - runs.length / painted) * 100) : 0 })}</span>
          </div>

          <div className="row">
            <div className="tabs" role="tablist">
              <button type="button" role="tab" className="btn" aria-selected={tab === 'jsx'} onClick={() => setTab('jsx')}>
                JSX
              </button>
              <button type="button" role="tab" className="btn" aria-selected={tab === 'svg'} onClick={() => setTab('svg')}>
                SVG
              </button>
            </div>
            <button type="button" className="btn" onClick={copyLink.copy}>
              {copyLink.copied ? t('linkCopied') : t('copyLink')}
            </button>
          </div>
          <Code code={tab === 'jsx' ? toJsx(rows, palette, unit) : toSvg(rows, palette, { unit })} />
        </div>
      </div>
    </>
  )
}

function PaletteRow({ ch, value, onChange }: { ch: string; value: string; onChange: (color: string) => void }) {
  const t = useT()
  return (
    <>
      <span className="char">{ch}</span>
      <input
        type="color"
        className="swatch"
        value={toHex(value) ?? '#000000'}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('playground.pick', { ch })}
      />
      <input
        className="field"
        value={value}
        placeholder={t('playground.placeholder')}
        aria-invalid={value ? undefined : true}
        aria-label={t('playground.color', { ch })}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
}

function useCopyLink() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return { copied, copy }
}
