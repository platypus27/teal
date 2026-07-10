import tealPreset from '../tailwind.preset.js'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tealPreset],
  content: ['./index.html', './src/**/*.{js,jsx}', '../ui/**/*.{js,jsx}'],
}
