import fs from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'resolve-root-or-src-entry',
      transformIndexHtml(html) {
        if (!fs.existsSync('./src/main.tsx') && fs.existsSync('./main.tsx')) {
          return html.replace('/src/main.tsx', '/main.tsx');
        }
        return html;
      },
    },
    react(),
    tailwindcss(),
  ],
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});


