import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    lib: {
      entry: { index: 'src/index.ts', react: 'src/react.tsx' },
      formats: ['es'],
    },
    rollupOptions: { external: ['react', 'react/jsx-runtime'] },
    sourcemap: true,
  },
  test: { environment: 'jsdom' },
})
