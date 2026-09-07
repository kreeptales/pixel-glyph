import { useEffect, useMemo, useState } from 'react'
import { bitmapSize, toRuns, toSvg, type Palette } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { BitmapText } from '../BitmapText'
import { Code } from '../Code'
import { PRESETS, type Drawing } from '../presets'
import { readShared, writeShared } from '../share'

const HEX = /^#[0-9a-f]{6}$/i

function toJsx(rows: readonly string[], palette: Palette, unit: number): string {
  return `import { PixelGlyph } from '@kreeptales/pixel-glyph/react'

const bitmap = [
${rows.map((row) => `  '${row}',`).join('\n')}
]
const palette = ${JSON.stringify(palette, null, 2)}

<PixelGlyph bitmap={bitmap} palette={palette} unit={${unit}} />`
}

export function Playground() {
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
        <BitmapText text="PLAYGROUND" scale={2} />
      </h2>
      <p>
        Type a bitmap, one row per line, any character but <code>.</code> is a pixel. Give each character a color:
        a literal or a <code>var(--token)</code> from this page. The link updates as you draw, so copy it to share.
      </p>

      <div className="playground">
        <div>
          <div className="row">
            <label htmlFor="bitmap">Bitmap</label>
            {Object.entries(PRESETS).map(([name, drawing]) => (
              <button key={name} type="button" className="btn" onClick={() => load(drawing)}>
                {name}
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
            <label>Palette</label>
            {missing.length > 0 && (
              <span className="muted">
                No color for: {missing.map((ch) => `'${ch}'`).join(' ')}
              </span>
            )}
          </div>
          <div className="palette">
            {chars.map((ch) => {
              const value = palette[ch] ?? ''
              return (
                <PaletteRow key={ch} ch={ch} value={value} onChange={(color) => setColor(ch, color)} />
              )
            })}
          </div>
        </div>

        <div>
          <div className="row">
            <label htmlFor="unit">
              Unit {unit}px <span className="muted">({+(unit * devicePixelRatio).toFixed(2)} device px per pixel)</span>
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
            <PixelGlyph bitmap={rows} palette={palette} unit={unit} label="Your drawing" />
          </div>
          <div className="stats">
            <span>
              {cols} x {rowCount}
            </span>
            <span>{painted} pixels painted</span>
            <span>
              {runs.length} rects ({painted ? Math.round((1 - runs.length / painted) * 100) : 0}% fewer than one per pixel)
            </span>
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
              {copyLink.copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
          <Code code={tab === 'jsx' ? toJsx(rows, palette, unit) : toSvg(rows, palette, { unit })} />
        </div>
      </div>
    </>
  )
}

function PaletteRow({ ch, value, onChange }: { ch: string; value: string; onChange: (color: string) => void }) {
  return (
    <>
      <span className="char">{ch}</span>
      <input
        type="color"
        className="swatch"
        value={HEX.test(value) ? value : '#2a2438'}
        style={{ background: value || 'transparent' }}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Pick a color for '${ch}'`}
      />
      <input
        className="field"
        value={value}
        placeholder="var(--ink) or #2a2438"
        aria-invalid={value ? undefined : true}
        aria-label={`Color for '${ch}'`}
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
