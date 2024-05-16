import * as path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  base: '/react-shopping-cart/dist',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
