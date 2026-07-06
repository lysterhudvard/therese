import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  image: {
    domains: [
      'a6c2528650.clvaw-cdnwnd.com',
      'images.unsplash.com',
      'uhdzswnawlqpsaajsjpo.supabase.co',
      'img.youtube.com'
    ]
  },
  vite: {
    envPrefix: ['VITE_', 'PUBLIC_'],
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});
