import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// The site imports the library from src/ through these aliases, so the playground
// exercises the real code and never a copy. Built as a static site to site/dist.
export default defineConfig({
  root: here('.'),
  resolve: {
    alias: [
      { find: '@kreeptales/pixel-glyph/react', replacement: here('../src/react.tsx') },
      { find: '@kreeptales/pixel-glyph', replacement: here('../src/index.ts') },
    ],
  },
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
})
