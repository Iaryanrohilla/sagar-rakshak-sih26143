import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl']
  },
  server: {
    port: 5173,
    host: true
  },
  // @ts-expect-error vitest config
  test: {
    include: ['src/tests/**/*.test.ts']
  }
})
