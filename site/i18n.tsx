import { createContext, useContext, type ReactNode } from 'react'

export type Lang = 'en' | 'es'
export const LANGS: readonly Lang[] = ['en', 'es']

const DICT = {
  'nav.intro': { en: 'Intro', es: 'Intro' },
  'nav.install': { en: 'Install', es: 'Instalar' },
  'nav.usage': { en: 'Usage', es: 'Uso' },
  'nav.playground': { en: 'Playground', es: 'Playground' },
  scale: { en: 'Scale', es: 'Escala' },
  'scale.auto': { en: 'Auto', es: 'Auto' },
  'theme.toLight': { en: 'Switch to light theme', es: 'Cambiar a tema claro' },
  'theme.toDark': { en: 'Switch to dark theme', es: 'Cambiar a tema oscuro' },
  'lang.switch': { en: 'Cambiar a español', es: 'Switch to English' },
  'footer.note': {
    en: 'Every graphic on this page is a PixelGlyph, titles included. No PNG, no icon font.',
    es: 'Todo lo gráfico de esta página es un PixelGlyph, títulos incluidos. Sin PNG ni fuentes de iconos.',
  },
  'footer.links': { en: 'Links', es: 'Enlaces' },
  mascot: { en: 'Pip, the mascot', es: 'Pip, la mascota' },
  copy: { en: 'Copy', es: 'Copiar' },
  copied: { en: 'Copied', es: 'Copiado' },
  copyLink: { en: 'Copy link', es: 'Copiar enlace' },
  linkCopied: { en: 'Link copied', es: 'Enlace copiado' },

  'intro.lead': {
    en: 'Draw a sprite as text. Get an SVG that stays sharp at any scale, with colors that follow your CSS variables.',
    es: 'Dibuja un sprite como texto. Obtén un SVG que se mantiene nítido a cualquier escala, con colores que siguen tus variables CSS.',
  },
  'intro.open': { en: 'Open the playground', es: 'Abrir el playground' },
  'intro.compare.title': { en: 'SAME BITMAP, THREE RENDERERS', es: 'MISMO BITMAP, TRES RENDERS' },
  'intro.compare.text': {
    en: 'The heart below is drawn three ways at {unit} CSS pixels per bitmap pixel, a fractional size on purpose. Zoom your browser to 90% or 110% and look at the edges and the gaps between pixels.',
    es: 'El corazón de abajo está dibujado de tres formas a {unit} píxeles CSS por píxel de bitmap, un tamaño fraccionario a propósito. Pon el zoom del navegador en 90% o 110% y mira los bordes y los huecos entre píxeles.',
  },
  'intro.compare.shadow': {
    en: 'box-shadow per pixel. Hairline seams appear wherever an edge lands between device pixels.',
    es: 'Un box-shadow por píxel. Aparecen líneas finas donde un borde cae entre píxeles del dispositivo.',
  },
  'intro.compare.png': {
    en: 'PNG with image-rendering: pixelated. Uneven pixel widths and no CSS colors.',
    es: 'PNG con image-rendering: pixelated. Píxeles de ancho desigual y sin colores CSS.',
  },
  'intro.compare.svg': {
    en: 'PixelGlyph: SVG rects with crispEdges. Every rect snaps to whole device pixels, no seams.',
    es: 'PixelGlyph: rects SVG con crispEdges. Cada rect se ajusta a píxeles enteros del dispositivo, sin costuras.',
  },
  'intro.get.title': { en: 'WHAT YOU GET', es: 'QUÉ OBTIENES' },
  'intro.get.1': {
    en: 'No seams and no blur at fractional device scales: browser zoom, 125% laptops, retina.',
    es: 'Sin costuras ni desenfoque a escalas fraccionarias: zoom del navegador, portátiles al 125%, retina.',
  },
  'intro.get.2': {
    en: 'Palettes are CSS: a character maps to any color, `var(--token)` included. Switch the theme in the header.',
    es: 'Las paletas son CSS: cada carácter apunta a cualquier color, `var(--token)` incluido. Cambia el tema en la cabecera.',
  },
  'intro.get.3': {
    en: 'One rect per horizontal run, not one per pixel. A 16x16 icon is a few dozen rects.',
    es: 'Un rect por tramo horizontal, no uno por píxel. Un icono de 16x16 son unas decenas de rects.',
  },
  'intro.get.4': {
    en: 'A framework-free core (`toSvg`, `toRuns`) and a React component with the same output.',
    es: 'Un núcleo sin framework (`toSvg`, `toRuns`) y un componente React con la misma salida.',
  },
  'intro.get.5': {
    en: 'Bitmaps live in code: versioned, diffable, reviewable, and copied around as strings.',
    es: 'Los bitmaps viven en el código: versionados, con diff, revisables y copiables como strings.',
  },
  'intro.get.6': { en: 'Zero dependencies. React is an optional peer.', es: 'Cero dependencias. React es un peer opcional.' },
  'intro.scale.title': { en: 'SEE IT SCALE', es: 'MÍRALO ESCALAR' },
  'intro.scale.text': {
    en: 'Change the scale in the header. The whole site, titles included, is sized from one CSS variable, and every glyph stays crisp because it is a PixelGlyph. That is the entire trick.',
    es: 'Cambia la escala en la cabecera. Todo el sitio, títulos incluidos, se dimensiona desde una sola variable CSS, y cada glifo sigue nítido porque es un PixelGlyph. Ese es todo el truco.',
  },

  'install.title': { en: 'INSTALL', es: 'INSTALACIÓN' },
  'install.text': {
    en: 'Two entry points. The core has no dependencies; the React entry needs React 18 or newer as a peer.',
    es: 'Dos puntos de entrada. El núcleo no tiene dependencias; la entrada de React necesita React 18 o superior como peer.',
  },
  'install.note': {
    en: 'ES modules with TypeScript declarations. The package ships dist/ only, about 1 kB gzipped per entry.',
    es: 'Módulos ES con declaraciones de TypeScript. El paquete publica solo dist/, alrededor de 1 kB gzip por entrada.',
  },

  'usage.react.title': { en: 'REACT', es: 'REACT' },
  'usage.react.text': {
    en: 'Without a label the SVG is hidden from assistive technology. With one it becomes an image with that name. `className` and `style` are passed through.',
    es: 'Sin `label`, el SVG queda oculto para la tecnología de asistencia. Con uno, pasa a ser una imagen con ese nombre. `className` y `style` se propagan.',
  },
  'usage.core.title': { en: 'CORE, NO FRAMEWORK', es: 'NÚCLEO, SIN FRAMEWORK' },
  'usage.core.text': {
    en: 'The same markup the component renders, as a string: plain HTML, Vue, Svelte, server templates or an image data URL. `toRuns` gives you the rectangles if you want to draw them yourself.',
    es: 'El mismo markup que renderiza el componente, como string: HTML plano, Vue, Svelte, plantillas de servidor o una data URL de imagen. `toRuns` te da los rectángulos si quieres dibujarlos tú.',
  },
  'usage.unit.title': { en: 'ONE UNIT FOR THE WHOLE UI', es: 'UNA UNIDAD PARA TODA LA UI' },
  'usage.unit.text': {
    en: 'A string unit is used as written and the glyph is sized with `calc(cols * unit)`. This site and RunenBow size everything from one `--px`, which is what the scale selector in the header changes.',
    es: 'Una unidad string se usa tal cual y el glifo se dimensiona con `calc(cols * unit)`. Este sitio y RunenBow dimensionan todo desde un solo `--px`, que es lo que cambia el selector de escala de la cabecera.',
  },
  'usage.palette.title': { en: 'PALETTES ARE CSS', es: 'LAS PALETAS SON CSS' },
  'usage.palette.text': {
    en: 'Fills go through `style`, so variables resolve where the glyph is rendered. Toggle the theme in the header: the bitmap stays, the colors follow. `currentColor` works too, for icons that follow text.',
    es: 'Los rellenos van por `style`, así que las variables se resuelven donde se renderiza el glifo. Cambia el tema en la cabecera: el bitmap se queda, los colores lo siguen. `currentColor` también funciona, para iconos que siguen al texto.',
  },

  'playground.title': { en: 'PLAYGROUND', es: 'PLAYGROUND' },
  'playground.text': {
    en: 'Type a bitmap, one row per line, any character but `.` is a pixel. Give each character a color: a literal or a `var(--token)` from this page. The link updates as you draw, so copy it to share.',
    es: 'Escribe un bitmap, una fila por línea; cualquier carácter salvo `.` es un píxel. Dale un color a cada carácter: un literal o un `var(--token)` de esta página. El enlace se actualiza mientras dibujas, cópialo para compartir.',
  },
  'playground.bitmap': { en: 'Bitmap', es: 'Bitmap' },
  'playground.palette': { en: 'Palette', es: 'Paleta' },
  'playground.missing': { en: 'No color for: {chars}', es: 'Sin color: {chars}' },
  'playground.unit': { en: 'Unit {unit}px', es: 'Unidad {unit}px' },
  'playground.devicePx': { en: '({n} device px per pixel)', es: '({n} px de dispositivo por píxel)' },
  'playground.preview': { en: 'Your drawing', es: 'Tu dibujo' },
  'playground.painted': { en: '{n} pixels painted', es: '{n} píxeles pintados' },
  'playground.rects': { en: '{n} rects ({p}% fewer than one per pixel)', es: '{n} rects ({p}% menos que uno por píxel)' },
  'playground.pick': { en: "Pick a color for '{ch}'", es: "Elige un color para '{ch}'" },
  'playground.color': { en: "Color for '{ch}'", es: "Color de '{ch}'" },
  'playground.placeholder': { en: 'var(--ink) or #2a2438', es: 'var(--ink) o #2a2438' },
  'preset.Rune': { en: 'Rune', es: 'Runa' },
  'preset.Flopi': { en: 'Flopi', es: 'Flopi' },
  'preset.Heart': { en: 'Heart', es: 'Corazón' },
} satisfies Record<string, Record<Lang, string>>

export type Key = keyof typeof DICT
type Vars = Record<string, string | number>

export const LangContext = createContext<Lang>('en')
export const useLang = () => useContext(LangContext)

export function translate(lang: Lang, key: Key, vars?: Vars): string {
  return DICT[key][lang].replace(/\{(\w+)\}/g, (_, name: string) => String(vars?.[name] ?? `{${name}}`))
}

export function useT() {
  const lang = useLang()
  return (key: Key, vars?: Vars) => translate(lang, key, vars)
}

/** A translated string where `backticks` become <code>. */
export function T({ k, vars }: { k: Key; vars?: Vars }) {
  const t = useT()
  const parts = t(k, vars).split('`')
  return <>{parts.map((part, i): ReactNode => (i % 2 ? <code key={i}>{part}</code> : part))}</>
}
