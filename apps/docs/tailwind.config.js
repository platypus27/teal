import tealPreset from '../../packages/teal/tailwind.preset.js'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tealPreset],
  content: ['./index.html', './src/**/*.{js,jsx}', '../../packages/teal/src/**/*.{ts,tsx}'],
}
