import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const apiTarget = mode === 'production'
    ? 'https://api.subradar.ai'
    : 'https://api-dev.subradar.ai'

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2019',
    },
    server: {
      port: 3200,
      proxy: {
        '/api/v1': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
