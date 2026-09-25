import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: mode === 'gas' ? { assetsInlineLimit: 100_000 } : undefined,
}));
