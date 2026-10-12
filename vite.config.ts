import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname, 'index.html'),
          menu: path.resolve(import.meta.dirname, 'menu.html'),
          story: path.resolve(import.meta.dirname, 'story.html'),
          gallery: path.resolve(import.meta.dirname, 'gallery.html'),
          reservations: path.resolve(import.meta.dirname, 'reservations.html'),
          contact: path.resolve(import.meta.dirname, 'contact.html'),
          privacy: path.resolve(import.meta.dirname, 'privacy.html'),
          cookies: path.resolve(import.meta.dirname, 'cookies.html'),
          refunds: path.resolve(import.meta.dirname, 'refunds.html'),
          terms: path.resolve(import.meta.dirname, 'terms.html'),
          accessibility: path.resolve(import.meta.dirname, 'accessibility.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
