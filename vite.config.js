import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import firebaseConfigPlugin from './plugins/firebase-config-plugin.js'

export default defineConfig({
  plugins: [vue(), tailwindcss(), firebaseConfigPlugin()],
  server: {
    allowedHosts: ['app.company-panel-saas.orb.local']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
