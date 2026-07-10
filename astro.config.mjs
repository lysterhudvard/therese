import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [preact({ compat: true })],
  build: {
    inlineStylesheets: 'always'
  },
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
        '@': '/src',
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime'
      }
    },
    ssr: {
      noExternal: ['framer-motion', 'lucide-react', '@radix-ui/*', 'react-day-picker', 'react-hook-form', 'react-resizable-panels', 'recharts']
    }
  }
});
