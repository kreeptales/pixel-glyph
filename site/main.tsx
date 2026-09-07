import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { toSvg } from '@kreeptales/pixel-glyph'
import { App } from './App'
import { LOGO, LOGO_HEX } from './bitmaps/glyphs'
import './styles.css'

// The favicon is the logo bitmap through the core API. Literal colors: a data URL has no CSS variables.
const icon = document.createElement('link')
icon.rel = 'icon'
icon.href = `data:image/svg+xml,${encodeURIComponent(toSvg(LOGO, LOGO_HEX))}`
document.head.append(icon)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
