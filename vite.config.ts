/// <reference types="vitest" />
import { defineConfig } from 'vite';

import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
});