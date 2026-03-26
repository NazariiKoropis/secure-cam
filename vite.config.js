import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      // basic
      '@': path.resolve(__dirname, './src'),

      // components
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@shared': path.resolve(__dirname, './src/components/shared'),

      // api
      '@api': path.resolve(__dirname, './src/api'),

      // constants
      '@constants': path.resolve(__dirname, './src/constants'),

      // hooks
      '@hooks': path.resolve(__dirname, './src/hooks'),

      // pages
      '@pages': path.resolve(__dirname, './src/pages'),

      // store
      '@store': path.resolve(__dirname, './src/redux'),

      // utils
      '@utils': path.resolve(__dirname, './src/utils'),

      // styles & assets
      '@styles': path.resolve(__dirname, './src/assets/styles'),
      '@images': path.resolve(__dirname, './src/assets/images'),
    }
  },

  css: {
    modules: {
      generateScopedName:
        mode === 'development'
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:6]',
    },
  },
}))