import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {

      //basic
      '@': path.resolve(__dirname, './src'),

      //components
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@shared': path.resolve(__dirname, './src/components/shared'),

      //api
      '@api': path.resolve(__dirname, './src/api'),

      //contantas
      '@constants': path.resolve(__dirname, './src/constants'),

      //pages
      '@pages': path.resolve(__dirname, './src/pages'),

      '@store': path.resolve(__dirname, './src/redux'),

      // styles
      '@styles': path.resolve(__dirname, './src/assets/styles'),
      '@images': path.resolve(__dirname, './src/assets/images')
    }
  }
})
