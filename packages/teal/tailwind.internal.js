import tealPreset from './tailwind.preset.js'

const publicTheme = tealPreset.theme.extend
const colors = Object.fromEntries(
  Object.entries(publicTheme.colors).map(([name, value]) => [
    name.replace(/^teal-/, ''),
    value,
  ]),
)

/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'teal-u-',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        headline: ['var(--teal-font-headline)'],
        body: ['var(--teal-font-body)'],
        label: ['var(--teal-font-body)'],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: 'var(--teal-radius-control)',
        '2xl': 'var(--teal-radius-surface)',
        '3xl': '1.5rem',
        full: 'var(--teal-radius-pill)',
      },
      boxShadow: {
        raised: 'var(--teal-shadow-raised)',
        overlay: 'var(--teal-shadow-overlay)',
      },
    },
  },
  plugins: [],
}
