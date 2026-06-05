import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // index.html is at the project root — this is the Vite default, stated explicitly
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/socket.io': { target: 'http://localhost:4000', ws: true },
      '/api':       { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
})