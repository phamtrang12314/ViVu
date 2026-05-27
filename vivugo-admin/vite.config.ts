import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: '0.0.0.0',
    proxy: {
      // Chuyển tiếp tất cả yêu cầu /api đến backend
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      // Chuyển tiếp tất cả yêu cầu /images đến backend
      '/images': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
