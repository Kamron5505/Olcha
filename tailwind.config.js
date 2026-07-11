/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#e63946',
        'primary-dark': '#c1121f',
        secondary: '#f4a261',
        dark: '#1d1d1d',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        olcha: {
          primary: '#e63946',
          'primary-focus': '#c1121f',
          'primary-content': '#ffffff',
          secondary: '#f4a261',
          'secondary-focus': '#e07b3a',
          'secondary-content': '#ffffff',
          accent: '#37cdbe',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f3f4f6',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
    ],
  },
};
