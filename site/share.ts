import type { Drawing } from './presets'

/** Longer query strings are refused by hosts on a cold load, so the link is dropped instead. */
export const MAX_SHARE = 12_000

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

/** Writes the drawing into the URL. Returns false, and removes any stale link, when it is too big to share. */
export function writeShared(drawing: Drawing): boolean {
  const encoded = encode(drawing)
  const url = new URL(location.href)
  const fits = encoded.length <= MAX_SHARE
  if (fits) url.searchParams.set('g', encoded)
  else url.searchParams.delete('g')
  try {
    history.replaceState(null, '', url)
  } catch {
    return false
  }
  return fits
}
