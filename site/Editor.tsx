import { useMemo, useRef, useState, type DragEvent, type PointerEvent } from 'react'
import type { Palette } from '@kreeptales/pixel-glyph'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'

type Cell = { x: number; y: number }

type Props = {
  rows: readonly string[]
  cols: number
  rowCount: number
  palette: Palette
  label: string
  onStrokeStart: () => void
  onPaint: (x: number, y: number, erase: boolean) => void
  onDropFile: (file: File) => void
}

/** The transparency checkerboard under the drawing: two cream tones, one glyph, memoized by size. */
const BOARD: Palette = { a: 'var(--cream)', b: 'var(--cream-2)' }

/**
 * A paintable grid. The drawing and the board are real PixelGlyphs; cells are
 * found from the pointer position, so there is no DOM node per pixel.
 */
export function Editor({ rows, cols, rowCount, palette, label, onStrokeStart, onPaint, onDropFile }: Props) {
  const canvas = useRef<HTMLDivElement>(null)
  const last = useRef<Cell | null>(null)
  const [over, setOver] = useState(false)

  // Cell size: fill about 160 pixel units, between 1 and 10 units per cell.
  const zoom = Math.min(10, Math.max(1, Math.floor(160 / Math.max(cols, rowCount, 1))))
  const unit = `calc(${zoom} * var(--px))`
  const board = useMemo(
    () => Array.from({ length: rowCount }, (_, y) => Array.from({ length: cols }, (_, x) => ((x + y) % 2 ? 'b' : 'a')).join('')),
    [cols, rowCount],
  )

  const cellAt = (e: PointerEvent): Cell | null => {
    const el = canvas.current
    if (!el || !cols || !rowCount) return null
    const rect = el.getBoundingClientRect()
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * cols)
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * rowCount)
    return x >= 0 && y >= 0 && x < cols && y < rowCount ? { x, y } : null
  }

  /** Paints every cell between the previous one and this one, so fast drags leave a solid line. */
  const stroke = (cell: Cell, erase: boolean) => {
    const from = last.current ?? cell
    const steps = Math.max(Math.abs(cell.x - from.x), Math.abs(cell.y - from.y))
    for (let i = 0; i <= steps; i++) {
      const t = steps ? i / steps : 1
      onPaint(Math.round(from.x + (cell.x - from.x) * t), Math.round(from.y + (cell.y - from.y) * t), erase)
    }
    last.current = cell
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 2) return
    const cell = cellAt(e)
    if (!cell) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Synthetic pointers have no capture; the stroke still works while the pointer stays inside.
    }
    onStrokeStart()
    last.current = null
    stroke(cell, e.button === 2)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.buttons || !last.current) return
    const cell = cellAt(e)
    if (cell) stroke(cell, (e.buttons & 2) !== 0)
  }

  const endStroke = () => {
    last.current = null
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onDropFile(file)
  }

  return (
    <div
      className="editor"
      data-over={over || undefined}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <div
        ref={canvas}
        className="editor-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        onContextMenu={(e) => e.preventDefault()}
      >
        <PixelGlyph bitmap={board} palette={BOARD} unit={unit} />
        <PixelGlyph bitmap={rows} palette={palette} unit={unit} label={label} />
      </div>
    </div>
  )
}
