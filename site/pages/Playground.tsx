import { useEffect, useMemo, useRef, useState } from 'react'
import { bitmapSize, toRuns, toSvg, type Palette } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { DOWNLOAD, ERASER, MONO, PENCIL, REDO, TRASH, UNDO, UPLOAD } from '../bitmaps/glyphs'
import { BitmapText } from '../BitmapText'
import { CopyButton } from '../Code'
import { Editor } from '../Editor'
import { blank, exportPng, importImage, ImportError, MAX_SIDE, nextChar, paint, resize, toHex } from '../editing'
import { T, useT, type Key } from '../i18n'
import { PRESETS, type Drawing } from '../presets'
import { readShared, writeShared } from '../share'

/** Colors handed to new palette entries, in order. */
const NEW_COLORS = [
  'var(--salmon)',
  'var(--mint)',
  'var(--sky)',
  'var(--sun)',
  'var(--lavender)',
  'var(--ink)',
  'var(--salmon-2)',
  'var(--mint-2)',
  'var(--lavender-2)',
  'var(--cream-3)',
]

type Notice = { k: Key; vars?: Record<string, string | number> }
type Tab = 'text' | 'jsx' | 'svg'
type Tool = 'brush' | 'eraser'

function toJsx(rows: readonly string[], palette: Palette, unit: number): string {
  return `import { PixelGlyph } from '@kreeptales/pixel-glyph/react'

const bitmap = [
${rows.map((row) => `  '${row}',`).join('\n')}
]
const palette = ${JSON.stringify(palette, null, 2)}

<PixelGlyph bitmap={bitmap} palette={palette} unit={${unit}} />`
}

type Snapshot = { text: string; palette: Palette }

/** Undo history of text and palette snapshots. Color edits alone are not recorded; erasing pixels is. */
function useHistory(current: Snapshot, apply: (next: Snapshot) => void) {
  const [past, setPast] = useState<Snapshot[]>([])
  const [future, setFuture] = useState<Snapshot[]>([])
  const snapshot = () => {
    setPast((p) => [...p.slice(-99), current])
    setFuture([])
  }
  const commit = (text: string, palette: Palette = current.palette) => {
    if (text === current.text && palette === current.palette) return
    snapshot()
    apply({ text, palette })
  }
  const undo = () => {
    const prev = past.at(-1)
    if (prev === undefined) return
    setPast((p) => p.slice(0, -1))
    setFuture((f) => [...f, current])
    apply(prev)
  }
  const redo = () => {
    const next = future.at(-1)
    if (next === undefined) return
    setFuture((f) => f.slice(0, -1))
    setPast((p) => [...p, current])
    apply(next)
  }
  return { snapshot, commit, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 }
}

export function Playground() {
  const t = useT()
  const [initial] = useState<Drawing>(() => readShared() ?? PRESETS.Rune)
  const [text, setText] = useState(initial.bitmap.join('\n'))
  const [palette, setPalette] = useState<Palette>(initial.palette)
  const [unit, setUnit] = useState(6)
  const [tab, setTab] = useState<Tab>('text')
  const [brushState, setBrushState] = useState('#')
  const [tool, setTool] = useState<Tool>('brush')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [shareable, setShareable] = useState(true)
  const [linkCopied, setLinkCopied] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const history = useHistory({ text, palette }, (next) => {
    setText(next.text)
    setPalette(next.palette)
  })

  const rows = useMemo(() => text.split('\n'), [text])
  const chars = useMemo(() => [...new Set(text.replace(/[.\n]/g, ''))], [text])
  const listed = useMemo(() => [...new Set([...chars, ...Object.keys(palette)])], [chars, palette])
  const { cols, rows: rowCount } = bitmapSize(rows)
  const runs = toRuns(rows, palette)
  const painted = chars.reduce((n, ch) => (palette[ch] ? n + (text.split(ch).length - 1) : n), 0)
  const missing = chars.filter((ch) => !palette[ch])
  const erasing = tool === 'eraser'
  const brush = listed.includes(brushState) ? brushState : (listed[0] ?? '#')
  /** Picking a color always switches back to the brush. */
  const setBrush = (ch: string) => {
    setBrushState(ch)
    setTool('brush')
  }

  // A stroke fires many changes per second; browsers throttle replaceState, so the URL follows with a delay.
  useEffect(() => {
    const id = setTimeout(() => setShareable(writeShared({ bitmap: rows, palette })), 300)
    return () => clearTimeout(id)
  }, [rows, palette])

  // Ctrl+Z / Ctrl+Y outside text fields; inside them the native undo stays.
  const keys = useRef(history)
  useEffect(() => {
    keys.current = history
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || (e.key.toLowerCase() !== 'z' && e.key.toLowerCase() !== 'y')) return
      const target = e.target as HTMLElement
      if (target.closest('input, textarea')) return
      e.preventDefault()
      if (e.key.toLowerCase() === 'y' || e.shiftKey) keys.current.redo()
      else keys.current.undo()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const load = (drawing: Drawing) => {
    history.commit(drawing.bitmap.join('\n'), drawing.palette)
    setNotice(null)
  }
  const setColor = (ch: string, color: string) => setPalette((p) => ({ ...p, [ch]: color }))
  /** The eraser tool erases with any button; the right mouse button erases with any tool. */
  const paintCell = (x: number, y: number, rightButton: boolean) =>
    setText((current) => {
      const next = paint(current.split('\n'), x, y, rightButton || erasing ? '.' : brush, cols)
      return next ? next.join('\n') : current
    })
  const resizeTo = (c: number, r: number) => {
    if (!Number.isFinite(c) || !Number.isFinite(r)) return
    history.commit(resize(rows, Math.min(MAX_SIDE, Math.max(1, c)), Math.min(MAX_SIDE, Math.max(1, r))).join('\n'))
  }
  const clear = () => history.commit(blank(cols || 16, rowCount || 16).join('\n'))
  const addColor = () => {
    const ch = nextChar(listed)
    if (!ch) return
    setPalette((p) => ({ ...p, [ch]: NEW_COLORS[listed.length % NEW_COLORS.length] }))
    setBrush(ch)
  }
  /** Drops the palette entry and erases its pixels; undo brings the pixels back. */
  const removeColor = (ch: string) => {
    history.commit(text.replaceAll(ch, '.'), Object.fromEntries(Object.entries(palette).filter(([key]) => key !== ch)))
    setBrushState(listed.find((other) => other !== ch) ?? '#')
  }
  const onImport = async (file: File) => {
    try {
      const drawing = await importImage(file)
      history.commit(drawing.bitmap.join('\n'), drawing.palette)
      const big = drawing.width > MAX_SIDE || drawing.height > MAX_SIDE
      setNotice(big ? { k: 'playground.imported.big', vars: { w: drawing.width, h: drawing.height, max: MAX_SIDE } } : null)
    } catch (error) {
      const code = error instanceof ImportError ? error.code : 'read'
      const info = error instanceof ImportError ? error.info : {}
      setNotice({ k: `playground.import.${code}` as Key, vars: info })
    }
  }
  const copyLink = async () => {
    const ok = writeShared({ bitmap: rows, palette })
    setShareable(ok)
    if (!ok) return
    await navigator.clipboard.writeText(location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 1200)
  }

  const output = tab === 'jsx' ? toJsx(rows, palette, unit) : tab === 'svg' ? toSvg(rows, palette, { unit }) : text
  const icon = (bitmap: readonly string[]) => <PixelGlyph bitmap={bitmap} palette={MONO} unit="var(--px)" />

  return (
    <>
      <h2 className="title">
        <BitmapText text={t('playground.title')} scale={2} />
      </h2>
      <p>
        <T k="playground.text" />
      </p>

      <div className="studio">
        <div className="studio-bar">
          <div className="row">
            {Object.entries(PRESETS).map(([name, drawing]) => (
              <button key={name} type="button" className="btn" onClick={() => load(drawing)}>
                {t(`preset.${name}` as Key)}
              </button>
            ))}
          </div>
          <div className="row studio-actions">
            <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
              {icon(UPLOAD)}
              {t('playground.import')}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onImport(file)
                e.target.value = ''
              }}
            />
            <button type="button" className="btn" onClick={() => exportPng(rows, palette)}>
              {icon(DOWNLOAD)}
              {t('playground.export')}
            </button>
            <button type="button" className="btn" onClick={copyLink} disabled={!shareable}>
              {shareable ? (linkCopied ? t('linkCopied') : t('copyLink')) : t('playground.tooBigToShare')}
            </button>
          </div>
        </div>

        {notice && (
          <p className="notice" role="alert">
            {t(notice.k, notice.vars)}
          </p>
        )}

        <div className="studio-body">
          <div className="rail" role="toolbar" aria-label={t('playground.tools')}>
            <button type="button" className="btn tool" onClick={history.undo} disabled={!history.canUndo} aria-label={t('playground.undo')} title={t('playground.undo')}>
              {icon(UNDO)}
            </button>
            <button type="button" className="btn tool" onClick={history.redo} disabled={!history.canRedo} aria-label={t('playground.redo')} title={t('playground.redo')}>
              {icon(REDO)}
            </button>
            <button
              type="button"
              className="btn tool"
              aria-pressed={!erasing}
              onClick={() => setTool('brush')}
              aria-label={t('playground.brush')}
              title={t('playground.brush')}
            >
              {icon(PENCIL)}
            </button>
            <button
              type="button"
              className="btn tool"
              aria-pressed={erasing}
              onClick={() => setTool('eraser')}
              aria-label={t('playground.eraser')}
              title={t('playground.eraser')}
            >
              {icon(ERASER)}
            </button>
            <button type="button" className="btn tool" onClick={clear} aria-label={t('playground.clear')} title={t('playground.clear')}>
              {icon(TRASH)}
            </button>
          </div>

          <div className="stage">
            <Editor
              rows={rows}
              cols={cols}
              rowCount={rowCount}
              palette={palette}
              label={t('playground.preview')}
              onStrokeStart={history.snapshot}
              onPaint={paintCell}
              onDropFile={onImport}
            />
            <div className="stage-status">
              <label className="size">
                <span className="muted">{t('playground.width')}</span>
                <input className="field" type="number" min={1} max={MAX_SIDE} value={cols} onChange={(e) => resizeTo(e.target.valueAsNumber, rowCount)} />
              </label>
              <label className="size">
                <span className="muted">{t('playground.height')}</span>
                <input className="field" type="number" min={1} max={MAX_SIDE} value={rowCount} onChange={(e) => resizeTo(cols, e.target.valueAsNumber)} />
              </label>
              <span className="stats">
                <span>{t('playground.painted', { n: painted })}</span>
                <span>{t('playground.rects', { n: runs.length, p: painted ? Math.round((1 - runs.length / painted) * 100) : 0 })}</span>
              </span>
            </div>
          </div>

          <aside className="side">
            <div className="row">
              <label>{t('playground.palette')}</label>
              <button type="button" className="btn" onClick={addColor} disabled={!nextChar(listed)}>
                {t('playground.addColor')}
              </button>
            </div>
            <div className="swatches">
              {listed.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className="swatch-btn"
                  style={{ background: palette[ch] || 'transparent' }}
                  aria-pressed={brush === ch}
                  data-missing={palette[ch] ? undefined : true}
                  onClick={() => setBrush(ch)}
                  aria-label={t('playground.paintWith', { ch })}
                  title={palette[ch] || t('playground.noColor')}
                >
                  <span>{ch}</span>
                </button>
              ))}
            </div>
            {listed.length > 0 && (
              <div className="color-edit">
                <span className="char">{brush}</span>
                <input
                  type="color"
                  className="swatch"
                  value={toHex(palette[brush] ?? '') ?? '#000000'}
                  onChange={(e) => setColor(brush, e.target.value)}
                  aria-label={t('playground.pick', { ch: brush })}
                />
                <input
                  className="field"
                  value={palette[brush] ?? ''}
                  placeholder={t('playground.placeholder')}
                  aria-invalid={palette[brush] ? undefined : true}
                  aria-label={t('playground.color', { ch: brush })}
                  onChange={(e) => setColor(brush, e.target.value)}
                />
                <button
                  type="button"
                  className="btn tool"
                  onClick={() => removeColor(brush)}
                  disabled={listed.length < 2}
                  aria-label={t('playground.removeColor', { ch: brush })}
                  title={t('playground.removeColor', { ch: brush })}
                >
                  {icon(TRASH)}
                </button>
              </div>
            )}
            {missing.length > 0 && (
              <p className="caption">{t('playground.missing', { chars: missing.map((ch) => `'${ch}'`).join(' ') })}</p>
            )}

            <div className="row">
              <label htmlFor="unit">{t('playground.preview')}</label>
            </div>
            <div className="preview">
              <PixelGlyph bitmap={rows} palette={palette} unit={unit} label={t('playground.preview')} />
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
            <p className="caption">
              {t('playground.unit', { unit })} {t('playground.devicePx', { n: +(unit * devicePixelRatio).toFixed(2) })}
            </p>
          </aside>
        </div>

        <div className="studio-out">
          <div className="code-bar">
            <div className="tabs" role="tablist">
              {(['text', 'jsx', 'svg'] as const).map((id) => (
                <button key={id} type="button" role="tab" className="btn" aria-selected={tab === id} onClick={() => setTab(id)}>
                  {id === 'text' ? t('playground.textTab') : id.toUpperCase()}
                </button>
              ))}
            </div>
            <CopyButton text={output} />
          </div>
          {tab === 'text' ? (
            <textarea
              id="bitmap"
              className="field bitmap"
              value={text}
              rows={Math.min(24, Math.max(6, rowCount + 1))}
              onChange={(e) => history.commit(e.target.value.replace(/\r/g, ''))}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label={t('playground.bitmap')}
            />
          ) : (
            <pre>
              <code>{output}</code>
            </pre>
          )}
        </div>
      </div>
      <p className="caption">
        <T k="playground.dropHint" />
      </p>
    </>
  )
}
