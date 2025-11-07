import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})

//In der Datei vite.config.js wird das Vue-Plugin aktiviert, damit Vite .vue-Dateien verarbeiten kann.