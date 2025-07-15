import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  base: '/cronicas-do-crepusculo/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    }
  },
});