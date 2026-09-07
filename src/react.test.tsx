import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PixelGlyph } from './react'

const palette = { '#': 'var(--ink)', s: 'var(--salmon)' }
const cross = ['.#.', '#s#', '.#.']

describe('PixelGlyph', () => {
  it('renders one crisp-edged rect per run, sized by the unit', () => {
    const { container } = render(<PixelGlyph bitmap={cross} palette={palette} unit="var(--px)" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('viewBox')).toBe('0 0 3 3')
    expect(svg.getAttribute('shape-rendering')).toBe('crispEdges')
    expect(svg.style.width).toBe('calc(3 * var(--px))')
    expect(svg.style.display).toBe('inline-block')
    const rects = svg.querySelectorAll('rect')
    expect(rects).toHaveLength(5)
    expect(rects[2].getAttribute('x')).toBe('1')
    expect(rects[2].style.fill).toBe('var(--salmon)')
  })

  it('defaults to one CSS pixel per bitmap pixel', () => {
    const { container } = render(<PixelGlyph bitmap={cross} palette={palette} />)
    expect(container.querySelector('svg')!.style.height).toBe('3px')
  })

  it('renders hidden from assistive tech by default', () => {
    const { container } = render(<PixelGlyph bitmap={cross} palette={palette} />)
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders as an image when labelled', () => {
    render(<PixelGlyph bitmap={cross} palette={palette} label="RunenBow logo" />)
    expect(screen.getByRole('img', { name: 'RunenBow logo' })).toBeTruthy()
  })

  it('merges className and style', () => {
    const { container } = render(<PixelGlyph bitmap={cross} palette={palette} className="big" style={{ margin: 4 }} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('class')).toBe('big')
    expect(svg.style.margin).toBe('4px')
  })
})
