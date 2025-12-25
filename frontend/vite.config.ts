import tailwindcss from '@tailwindcss/vite'; // <-- This is the magic link
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- This must be here
  ],
})