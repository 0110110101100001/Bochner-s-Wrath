import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Extension pages load from chrome-extension://, where Vite's default
 * `crossorigin` attributes are unnecessary and have historically tripped up
 * asset loading. Strip them and keep asset URLs relative.
 */
const extensionHtml = {
  name: 'extension-html',
  transformIndexHtml(html: string) {
    return html.replace(/\s+crossorigin(="[^"]*")?/g, '')
  },
}

export default defineConfig({
  base: './',
  plugins: [react(), extensionHtml],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'chrome110',
    cssCodeSplit: false,
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        // Stable, extension-friendly file names; no cache busting needed offline.
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
