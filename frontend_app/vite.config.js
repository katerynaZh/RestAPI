import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js', // your custom setup
  },
})
