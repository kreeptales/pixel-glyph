import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: { index: 'src/index.ts', react: 'src/react.tsx' },
      formats: ['es'],
    },
    rollupOptions: { external: ['react', 'react/jsx-runtime'] },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    // Site tests import the library by its package name; resolve it from src/ (no dist/ in CI).
    alias: [
      { find: '@kreeptales/pixel-glyph/react', replacement: here('src/react.tsx') },
      { find: '@kreeptales/pixel-glyph', replacement: here('src/index.ts') },
    ],
  },
})
