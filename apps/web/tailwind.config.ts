import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#f5bb1e',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
