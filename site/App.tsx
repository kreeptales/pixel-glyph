import { useEffect, useState } from 'react'
import { PixelGlyph } from '@kreeptales/pixel-glyph/react'
import { BitmapText } from './BitmapText'
import { LINK, LOGO, LOGO_PALETTE, MONO, MOON, PIP, PIP_PALETTE, SUN } from './bitmaps/glyphs'
import { Install } from './pages/Install'
import { Intro } from './pages/Intro'
import { Playground } from './pages/Playground'
import { Usage } from './pages/Usage'

const PAGES = { intro: Intro, install: Install, usage: Usage, playground: Playground } as const
type Page = keyof typeof PAGES
const isPage = (value: string): value is Page => value in PAGES

const SCALES = ['auto', '100', '125', '150'] as const
type Scale = (typeof SCALES)[number]
type Theme = 'light' | 'dark'

const read = <T extends string>(key: string, valid: readonly T[], fallback: T): T => {
  try {
    const value = localStorage.getItem(key)
    return value && (valid as readonly string[]).includes(value) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

function usePage(): Page {
  const current = () => {
    const hash = location.hash.slice(1)
    return isPage(hash) ? hash : 'intro'
  }
  const [page, setPage] = useState<Page>(current)
  useEffect(() => {
    const onChange = () => setPage(current())
    addEventListener('hashchange', onChange)
    return () => removeEventListener('hashchange', onChange)
  }, [])
  return page
}

/** Pip blinks every few seconds unless the visitor prefers reduced motion. */
function Mascot() {
  const [blink, setBlink] = useState(false)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 160)
    }, 3200)
    return () => clearInterval(timer)
  }, [])
  return <PixelGlyph bitmap={blink ? PIP.blink : PIP.idle} palette={PIP_PALETTE} unit="calc(2 * var(--px))" label="Pip, the mascot" />
}

export function App() {
  const page = usePage()
  const [scale, setScale] = useState<Scale>(() => read('pixel-glyph:scale', SCALES, 'auto'))
  const [theme, setTheme] = useState<Theme>(() =>
    read('pixel-glyph:theme', ['light', 'dark'], matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  )
  const Current = PAGES[page]

  useEffect(() => {
    const root = document.documentElement
    if (scale === 'auto') root.style.removeProperty('--px')
    else root.style.setProperty('--px', `${(2 * Number(scale)) / 100}px`)
    try {
      localStorage.setItem('pixel-glyph:scale', scale)
    } catch {}
  }, [scale])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('pixel-glyph:theme', theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    scrollTo(0, 0)
  }, [page])

  return (
    <div className="site">
      <header className="header">
        <a className="brand" href="#intro">
          <PixelGlyph bitmap={LOGO} palette={LOGO_PALETTE} unit="var(--px)" />
          <BitmapText text="PIXEL GLYPH" />
        </a>
        <nav className="nav" aria-label="Pages">
          {(Object.keys(PAGES) as Page[]).map((key) => (
            <a key={key} href={`#${key}`} aria-current={key === page ? 'page' : undefined}>
              {key[0].toUpperCase() + key.slice(1)}
            </a>
          ))}
        </nav>
        <div className="tools">
          <label>
            <span className="muted">Scale </span>
            <select className="select" value={scale} onChange={(e) => setScale(e.target.value as Scale)}>
              {SCALES.map((s) => (
                <option key={s} value={s}>
                  {s === 'auto' ? 'Auto' : `${s}%`}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <PixelGlyph bitmap={theme === 'dark' ? SUN : MOON} palette={MONO} unit="var(--px)" />
          </button>
        </div>
      </header>

      <main>
        <Current />
      </main>

      <footer className="footer">
        <Mascot />
        <span>Every graphic on this page is a PixelGlyph, titles included. No PNG, no icon font.</span>
        <nav aria-label="Links">
          <a href="https://github.com/kreeptales/pixel-glyph">
            <PixelGlyph bitmap={LINK} palette={MONO} unit="var(--px)" /> GitHub
          </a>
          <a href="https://www.npmjs.com/package/@kreeptales/pixel-glyph">
            <PixelGlyph bitmap={LINK} palette={MONO} unit="var(--px)" /> npm
          </a>
          <span>MIT</span>
        </nav>
      </footer>
    </div>
  )
}
