import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    modulePreload: {
      resolveDependencies(_filename, deps) {
        return deps.filter((dep) => !dep.includes('vendor-motion') && !dep.includes('vendor-forms'))
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          if (id.includes('@tanstack')) return 'vendor-query'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('react-icons') || id.includes('lucide-react')) return 'vendor-icons'
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('yup')) return 'vendor-forms'
          if (id.includes('axios')) return 'vendor-http'
          return 'vendor'
        }
      }
    }
  },
  server: {
    port: 5173,
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
