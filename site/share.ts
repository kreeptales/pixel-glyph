import type { Drawing } from './presets'

/** The playground drawing lives in the `g` query parameter so a link restores it. The hash stays for navigation. */
export function encode(drawing: Drawing): string {
  const bytes = new TextEncoder().encode(JSON.stringify(drawing))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decode(text: string): Drawing | null {
  try {
    const b64 = text.replace(/-/g, '+').replace(/_/g, '/')
    const json = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)))
    const value = JSON.parse(json) as Partial<Drawing>
    if (!Array.isArray(value.bitmap) || typeof value.palette !== 'object' || value.palette === null) return null
    return { bitmap: value.bitmap.map(String), palette: value.palette }
  } catch {
    return null
  }
}

export function readShared(): Drawing | null {
  const g = new URLSearchParams(location.search).get('g')
  return g ? decode(g) : null
}

export function writeShared(drawing: Drawing): void {
  const url = new URL(location.href)
  url.searchParams.set('g', encode(drawing))
  history.replaceState(null, '', url)
}
