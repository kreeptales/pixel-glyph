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
    en: 'Every image on this page, titles included, is drawn by the library. There are no PNG files and no icon font.',
    es: 'Todas las imágenes de esta página, títulos incluidos, las dibuja la librería. No hay archivos PNG ni fuentes de iconos.',
  },
  'footer.links': { en: 'Links', es: 'Enlaces' },
  mascot: { en: 'Pip, the mascot', es: 'Pip, la mascota' },
  copy: { en: 'Copy', es: 'Copiar' },
  copied: { en: 'Copied', es: 'Copiado' },
  copyLink: { en: 'Copy link', es: 'Copiar enlace' },
  linkCopied: { en: 'Link copied', es: 'Enlace copiado' },

  'intro.lead': {
    en: 'Write a sprite as lines of text and get an SVG that stays sharp at any size. Its colors can come from your CSS variables, so it follows your theme.',
    es: 'Escribe un sprite como líneas de texto y obtén un SVG que se ve nítido a cualquier tamaño. Sus colores pueden salir de tus variables CSS, así que sigue tu tema.',
  },
  'intro.open': { en: 'Open the playground', es: 'Abrir el playground' },
  'intro.compare.title': { en: 'SAME BITMAP, THREE RENDERERS', es: 'MISMO BITMAP, TRES RENDERS' },
  'intro.compare.text': {
    en: 'Each heart below is the same bitmap, drawn three different ways. Each bitmap pixel is {unit} CSS pixels wide, a size that does not divide evenly into screen pixels. Set your browser zoom to 90% or 110% and compare the edges and the gaps between pixels.',
    es: 'Los tres corazones son el mismo bitmap dibujado de tres maneras. Cada píxel del bitmap mide {unit} píxeles CSS, un tamaño que no cae justo en píxeles de pantalla. Pon el zoom del navegador en 90% o 110% y compara los bordes y los huecos entre píxeles.',
  },
  'intro.compare.shadow': {
    en: 'One box-shadow per pixel. Thin lines appear wherever a pixel edge falls between two screen pixels.',
    es: 'Un box-shadow por píxel. Aparecen líneas finas donde el borde de un píxel cae entre dos píxeles de pantalla.',
  },
  'intro.compare.png': {
    en: 'A PNG scaled with image-rendering: pixelated. Some pixels come out wider than others, and the colors are fixed in the file.',
    es: 'Un PNG escalado con image-rendering: pixelated. Algunos píxeles salen más anchos que otros, y los colores están fijos en el archivo.',
  },
  'intro.compare.svg': {
    en: 'PixelGlyph: SVG rectangles with antialiasing turned off. Each rectangle lands on whole screen pixels, so there are no gaps.',
    es: 'PixelGlyph: rectángulos SVG con el antialiasing apagado. Cada rectángulo cae en píxeles enteros de pantalla, así que no quedan huecos.',
  },
  'intro.get.title': { en: 'WHAT YOU GET', es: 'QUÉ OBTIENES' },
  'intro.get.1': {
    en: 'Sharp pixels even when a bitmap pixel does not map to a whole number of screen pixels: browser zoom, 125% laptops, retina screens.',
    es: 'Píxeles nítidos incluso cuando un píxel del bitmap no equivale a un número entero de píxeles de pantalla: zoom del navegador, portátiles al 125%, pantallas retina.',
  },
  'intro.get.2': {
    en: 'Colors are plain CSS. Each character in the bitmap maps to a color, and `var(--token)` works, so a glyph changes with the theme. Try the theme button in the header.',
    es: 'Los colores son CSS normal. Cada carácter del bitmap apunta a un color, y `var(--token)` funciona, así que un glifo cambia con el tema. Prueba el botón de tema de la cabecera.',
  },
  'intro.get.3': {
    en: 'Neighboring pixels of the same color become one SVG rectangle, so a 16x16 icon needs a few dozen rectangles instead of 256.',
    es: 'Los píxeles vecinos del mismo color se unen en un solo rectángulo SVG, así que un icono de 16x16 necesita unas decenas de rectángulos en vez de 256.',
  },
  'intro.get.4': {
    en: 'A core with no framework (`toSvg`, `toRuns`) for plain HTML, Vue or Svelte, and a React component that produces the same markup.',
    es: 'Un núcleo sin framework (`toSvg`, `toRuns`) para HTML plano, Vue o Svelte, y un componente React que produce el mismo markup.',
  },
  'intro.get.5': {
    en: 'Bitmaps are strings in your code, so they go through version control and code review like everything else, and you can paste one into a chat.',
    es: 'Los bitmaps son strings en tu código, así que pasan por el control de versiones y la revisión de código como todo lo demás, y puedes pegar uno en un chat.',
  },
  'intro.get.6': {
    en: 'No dependencies. React is needed only if you use the React component.',
    es: 'Sin dependencias. React solo hace falta si usas el componente React.',
  },
  'intro.scale.title': { en: 'SEE IT SCALE', es: 'MÍRALO ESCALAR' },
  'intro.scale.text': {
    en: 'Change the scale in the header. The whole site, titles included, takes its size from one CSS variable, and every image stays sharp because each one is a glyph drawn by the library.',
    es: 'Cambia la escala en la cabecera. Todo el sitio, títulos incluidos, toma su tamaño de una sola variable CSS, y cada imagen sigue nítida porque todas son glifos dibujados por la librería.',
  },

  'install.title': { en: 'INSTALL', es: 'INSTALACIÓN' },
  'install.text': {
    en: 'The package has two entry points. The core has no dependencies. The React entry needs React 18 or newer installed in your project.',
    es: 'El paquete tiene dos puntos de entrada. El núcleo no tiene dependencias. La entrada de React necesita React 18 o superior instalado en tu proyecto.',
  },
  'install.note': {
    en: 'Ships as ES modules with TypeScript types. Only the dist/ folder is published, about 1 kB gzipped per entry.',
    es: 'Se publica como módulos ES con tipos de TypeScript. Solo se publica la carpeta dist/, alrededor de 1 kB comprimido por entrada.',
  },

  'usage.react.title': { en: 'REACT', es: 'REACT' },
  'usage.react.text': {
    en: 'Without a `label`, screen readers skip the SVG. With one, it is announced as an image with that name. `className` and `style` go straight to the SVG element.',
    es: 'Sin `label`, los lectores de pantalla ignoran el SVG. Con uno, se anuncia como una imagen con ese nombre. `className` y `style` van directo al elemento SVG.',
  },
  'usage.core.title': { en: 'CORE, NO FRAMEWORK', es: 'NÚCLEO, SIN FRAMEWORK' },
  'usage.core.text': {
    en: '`toSvg` returns the same markup the React component renders, as a string. Use it in plain HTML, Vue, Svelte, a server template or an image data URL. If you would rather draw the pixels yourself, `toRuns` gives you the list of rectangles.',
    es: '`toSvg` devuelve el mismo markup que renderiza el componente React, como string. Sirve para HTML plano, Vue, Svelte, una plantilla de servidor o una data URL de imagen. Si prefieres dibujar los píxeles tú, `toRuns` te da la lista de rectángulos.',
  },
  'usage.unit.title': { en: 'ONE UNIT FOR THE WHOLE UI', es: 'UNA UNIDAD PARA TODA LA UI' },
  'usage.unit.text': {
    en: 'The `unit` is the size of one bitmap pixel. A number means pixels. A string such as `var(--px)` is used as written, so the whole interface can share one pixel size and change it in one place. That is what the scale selector in the header does.',
    es: 'La `unit` es el tamaño de un píxel del bitmap. Un número son píxeles. Un string como `var(--px)` se usa tal cual, así que toda la interfaz puede compartir un mismo tamaño de píxel y cambiarlo en un solo lugar. Eso es lo que hace el selector de escala de la cabecera.',
  },
  'usage.palette.title': { en: 'PALETTES ARE CSS', es: 'LAS PALETAS SON CSS' },
  'usage.palette.text': {
    en: 'Each color is written into the rectangle as an inline style, so a `var(--token)` is resolved where the glyph appears. Press the theme button in the header: the bitmap stays the same and the colors change. `currentColor` also works, for icons that should match the text around them.',
    es: 'Cada color se escribe en el rectángulo como estilo inline, así que un `var(--token)` se resuelve donde aparece el glifo. Pulsa el botón de tema de la cabecera: el bitmap queda igual y los colores cambian. `currentColor` también funciona, para iconos que deben ir del color del texto que los rodea.',
  },

  'playground.title': { en: 'PLAYGROUND', es: 'PLAYGROUND' },
  'playground.text': {
    en: 'Type your bitmap in the box, one row per line. A dot is an empty pixel; any other character is a painted pixel. Below the box, give each character a color: a hex value or a `var(--token)` from this page. The page address updates while you draw, so copying the link shares your drawing.',
    es: 'Escribe tu bitmap en la caja, una fila por línea. Un punto es un píxel vacío; cualquier otro carácter es un píxel pintado. Debajo de la caja, dale un color a cada carácter: un valor hex o un `var(--token)` de esta página. La dirección de la página se actualiza mientras dibujas, así que copiar el enlace comparte tu dibujo.',
  },
  'playground.bitmap': { en: 'Bitmap', es: 'Bitmap' },
  'playground.palette': { en: 'Palette', es: 'Paleta' },
  'playground.missing': { en: 'No color yet for: {chars}', es: 'Sin color todavía: {chars}' },
  'playground.unit': { en: 'Pixel size: {unit}px', es: 'Tamaño de píxel: {unit}px' },
  'playground.devicePx': { en: '({n} screen pixels each on this display)', es: '({n} píxeles de pantalla cada uno en esta pantalla)' },
  'playground.preview': { en: 'Your drawing', es: 'Tu dibujo' },
  'playground.painted': { en: '{n} painted pixels', es: '{n} píxeles pintados' },
  'playground.rects': { en: '{n} rectangles, {p}% fewer than one per pixel', es: '{n} rectángulos, {p}% menos que uno por píxel' },
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
