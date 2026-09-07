import { describe, expect, it } from 'vitest'
import { toSvg } from './svg'

const palette = { '#': 'var(--ink)', s: '#e07a5f' }
const cross = ['.#.', '#s#', '.#.']

describe('toSvg', () => {
  it('renders a crisp-edged svg with one rect per run', () => {
    const svg = toSvg(cross, palette)
    expect(svg).toContain('viewBox="0 0 3 3"')
    expect(svg).toContain('shape-rendering="crispEdges"')
    expect(svg).toContain('aria-hidden="true"')
    expect(svg.match(/<rect /g)).toHaveLength(5)
    expect(svg).toContain('<rect x="1" y="1" width="1" height="1" style="fill:#e07a5f"/>')
  })

  it('sizes from a numeric unit in px or a CSS string as written', () => {
    expect(toSvg(cross, palette)).toContain('width:3px;height:3px')
    expect(toSvg(cross, palette, { unit: 2.5 })).toContain('width:7.5px')
    expect(toSvg(cross, palette, { unit: 'var(--px)' })).toContain('width:calc(3 * var(--px))')
  })

  it('exposes a labelled glyph as an image with a title', () => {
    const svg = toSvg(cross, palette, { label: 'Tom & "Jerry" <3' })
    expect(svg).toContain('role="img" aria-label="Tom &amp; &quot;Jerry&quot; &lt;3"')
    expect(svg).toContain('<title>Tom &amp; &quot;Jerry&quot; &lt;3</title>')
  })

  it('carries the inline-block base style', () => {
    expect(toSvg(cross, palette)).toContain('style="display:inline-block;flex:none;overflow:visible;')
  })
})
