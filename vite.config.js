import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  base: './',
  build: {
    outDir: 'docs/tree',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  },
});
