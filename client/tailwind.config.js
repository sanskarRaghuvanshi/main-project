/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF4D8B', light: '#FFB6D0', dark: '#C2185B' },
        accent: '#FFB347',
        surface: '#FFF5F7',
        'surface-2': '#FFFFFF',
        text: '#1A1A2E',
        'text-muted': '#6B7280',
        border: '#F3E4EA',
        success: '#10B981',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(255,77,139,0.08)',
        hover: '0 8px 32px rgba(255,77,139,0.16)',
        modal: '0 24px 64px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};
