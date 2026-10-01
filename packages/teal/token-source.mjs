/**
 * Canonical semantic token source. Generated consumers are tokens.css,
 * tailwind.preset.js, and the documentation token metadata.
 *
 * Palette: Voxel World (ADR 0007) — day is warm cream glass over sky, night
 * is deep teal glass. Source of truth: the approved redesign-2026 mockups.
 */
export const colorTokens = {
  /* Ink: soft green-black day, pale mint night. */
  'teal-color-on-surface': { light: [34, 66, 58], dark: [220, 239, 230] },
  'teal-color-primary-dim': { light: [0, 94, 96], dark: [45, 212, 191] },
  'teal-color-secondary-fixed-dim': { light: [6, 90, 96], dark: [45, 212, 191] },
  'teal-color-on-error-container': { light: [122, 41, 32], dark: [255, 200, 204] },
  'teal-color-on-tertiary-fixed-variant': { light: [2, 54, 54], dark: [0, 0, 0] },
  'teal-color-on-tertiary-fixed': { light: [2, 54, 54], dark: [0, 0, 0] },
  'teal-color-on-tertiary-container': { light: [2, 54, 54], dark: [255, 255, 255] },
  'teal-color-inverse-on-surface': { light: [220, 239, 230], dark: [34, 66, 58] },
  'teal-color-on-tertiary': { light: [255, 255, 255], dark: [0, 0, 0] },
  /* Surfaces: warm cream glass day, deep teal glass night. */
  'teal-color-surface': { light: [252, 247, 234], dark: [13, 30, 38] },
  'teal-color-on-primary-container': { light: [2, 54, 54], dark: [255, 255, 255] },
  'teal-color-error-container': { light: [255, 228, 230], dark: [127, 29, 29] },
  'teal-color-secondary-fixed': { light: [224, 245, 244], dark: [10, 46, 46] },
  /* Status: success / warning / error / stale per the redesign brief. The
     warning and success day values are darkened from the mockup hues to keep
     AA text contrast on tinted chips (see test/tokens.test.ts). */
  'teal-color-tertiary': { light: [40, 110, 70], dark: [74, 222, 128] },
  'teal-color-error-dim': { light: [148, 44, 34], dark: [235, 105, 90] },
  'teal-color-surface-bright': { light: [255, 255, 255], dark: [38, 68, 80] },
  'teal-color-tertiary-container': { light: [209, 250, 229], dark: [6, 78, 59] },
  'teal-color-primary': { light: [15, 106, 108], dark: [45, 212, 191] },
  'teal-color-background': { light: [247, 237, 212], dark: [6, 16, 21] },
  'teal-color-surface-container': { light: [247, 240, 222], dark: [18, 38, 48] },
  'teal-color-tertiary-fixed': { light: [167, 243, 208], dark: [45, 212, 191] },
  'teal-color-surface-dim': { light: [238, 226, 200], dark: [8, 20, 26] },
  'teal-color-secondary': { light: [6, 90, 96], dark: [45, 212, 191] },
  'teal-color-surface-variant': { light: [240, 231, 208], dark: [26, 50, 61] },
  'teal-color-on-primary': { light: [255, 255, 255], dark: [0, 0, 0] },
  'teal-color-error': { light: [179, 55, 43], dark: [255, 122, 107] },
  'teal-color-warning': { light: [134, 89, 20], dark: [245, 177, 76] },
  'teal-color-stale': { light: [113, 125, 111], dark: [107, 122, 112] },
  'teal-color-on-primary-fixed': { light: [255, 255, 255], dark: [0, 0, 0] },
  'teal-color-primary-fixed': { light: [15, 106, 108], dark: [45, 212, 191] },
  'teal-color-inverse-primary': { light: [224, 245, 244], dark: [0, 100, 102] },
  'teal-color-tertiary-fixed-dim': { light: [52, 211, 153], dark: [45, 212, 191] },
  'teal-color-surface-container-highest': { light: [238, 227, 203], dark: [29, 53, 65] },
  'teal-color-surface-container-lowest': { light: [252, 250, 240], dark: [10, 24, 31] },
  'teal-color-on-secondary-fixed': { light: [2, 54, 54], dark: [255, 255, 255] },
  'teal-color-on-primary-fixed-variant': { light: [255, 255, 255], dark: [0, 0, 0] },
  'teal-color-secondary-dim': { light: [11, 82, 87], dark: [45, 212, 191] },
  'teal-color-on-secondary-fixed-variant': { light: [255, 255, 255], dark: [0, 0, 0] },
  'teal-color-on-secondary-container': { light: [2, 54, 54], dark: [255, 255, 255] },
  'teal-color-on-secondary': { light: [255, 255, 255], dark: [0, 0, 0] },
  'teal-color-inverse-surface': { light: [34, 66, 58], dark: [220, 239, 230] },
  'teal-color-primary-fixed-dim': { light: [15, 106, 108], dark: [45, 212, 191] },
  /* Borders: warm umber day, cool sea-glass night. */
  'teal-color-outline-variant': { light: [206, 186, 156], dark: [61, 94, 105] },
  'teal-color-on-background': { light: [34, 66, 58], dark: [220, 239, 230] },
  'teal-color-surface-container-high': { light: [243, 234, 214], dark: [23, 45, 56] },
  'teal-color-secondary-container': { light: [224, 245, 244], dark: [0, 100, 102] },
  'teal-color-on-surface-variant': { light: [76, 106, 96], dark: [147, 179, 168] },
  'teal-color-outline': { light: [122, 90, 48], dark: [148, 196, 210] },
  'teal-color-surface-container-low': { light: [250, 245, 232], dark: [15, 33, 42] },
  'teal-color-surface-tint': { light: [15, 106, 108], dark: [45, 212, 191] },
  'teal-color-primary-container': { light: [224, 245, 244], dark: [0, 100, 102] },
  'teal-color-on-error': { light: [255, 255, 255], dark: [0, 0, 0] },
  /* Per-product accents (home teal / photos blossom / yang amber / trict
     coral / twinkle violet). Decorative roles; pair with on-primary-style
     foregrounds when used behind text. */
  'teal-color-product-home': { light: [15, 106, 108], dark: [45, 212, 191] },
  'teal-color-product-photos': { light: [194, 94, 126], dark: [240, 166, 192] },
  'teal-color-product-yang': { light: [185, 123, 30], dark: [245, 177, 76] },
  'teal-color-product-trict': { light: [194, 80, 60], dark: [255, 138, 107] },
  'teal-color-product-twinkle': { light: [109, 91, 208], dark: [167, 139, 250] },
}

export const sharedTokens = {
  '--teal-font-body': "'Manrope', ui-sans-serif, system-ui, sans-serif",
  '--teal-font-headline': "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  /* Radius scale (10/14/20/28px): controls use the control radius (0.875rem);
     panels and cards use the larger surface radius; nested items inside
     padded containers use the concentric nested radius (0.625rem); pill is
     reserved for icon-only controls (IconButton and friends), tags, and
     avatars. */
  '--teal-radius-control': '0.875rem',
  '--teal-radius-surface': '1.25rem',
  '--teal-radius-nested': 'calc(var(--teal-radius-control) - 0.25rem)',
  '--teal-radius-xl': '1.75rem',
  '--teal-radius-pill': '9999px',
  '--teal-border-subtle': 'color-mix(in srgb, var(--teal-color-outline-variant) 55%, transparent)',
  '--teal-border-strong': 'var(--teal-color-outline)',
  /* Flush focus ring: no gap between the control border and the highlight. */
  '--teal-focus-ring': '0 0 0 2px var(--teal-color-primary)',
  '--teal-shadow-raised': '0 1px 2px rgba(0, 35, 36, 0.04), 0 10px 28px -18px rgba(0, 84, 84, 0.22)',
  '--teal-shadow-card': 'var(--teal-shadow-raised)',
  '--teal-shadow-overlay': '0 2px 6px rgba(0, 20, 21, 0.1), 0 20px 56px -20px rgba(0, 20, 21, 0.38)',
  /* Voxel bevel: inset top highlight plus a deep ambient drop. Theme-aware
     (light value in :root, dark value in html.dark). */
  '--teal-shadow-voxel': {
    light: '0 1px 0 rgb(255 255 255 / 0.55) inset, 0 18px 50px rgb(31 64 44 / 0.22)',
    dark: '0 1px 0 rgb(255 255 255 / 0.06) inset, 0 18px 50px rgb(2 10 14 / 0.55)',
  },
  '--teal-icon-xs': '0.875rem',
  '--teal-icon-sm': '1rem',
  '--teal-icon-md': '1.25rem',
  '--teal-icon-lg': '1.5rem',
  '--teal-icon-xl': '2rem',
  '--teal-motion-fast': '160ms',
  '--teal-motion-standard': '200ms',
  '--teal-motion-med': '320ms',
  '--teal-motion-slow': '600ms',
  '--teal-motion-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--teal-z-popover': '40',
  '--teal-z-overlay': '50',
  '--teal-z-dialog': '51',
  '--teal-z-toast': '60',
  '--teal-z-tooltip': '70',
}

export const documentationColors = [
  { name: 'Primary', token: '--teal-color-primary', bg: 'bg-teal-primary', fg: 'text-teal-on-primary' },
  { name: 'Success', token: '--teal-color-tertiary', bg: 'bg-teal-tertiary', fg: 'text-teal-on-tertiary' },
  { name: 'Warning', token: '--teal-color-warning', bg: 'bg-teal-warning', fg: 'text-teal-on-primary' },
  { name: 'Danger', token: '--teal-color-error', bg: 'bg-teal-error', fg: 'text-teal-on-error' },
  { name: 'Stale', token: '--teal-color-stale', bg: 'bg-teal-stale', fg: 'text-teal-on-primary' },
  { name: 'Home accent', token: '--teal-color-product-home', bg: 'bg-teal-product-home', fg: 'text-teal-on-primary' },
  { name: 'Photos accent', token: '--teal-color-product-photos', bg: 'bg-teal-product-photos', fg: 'text-teal-on-primary' },
  { name: 'Yang accent', token: '--teal-color-product-yang', bg: 'bg-teal-product-yang', fg: 'text-teal-on-primary' },
  { name: 'Trict accent', token: '--teal-color-product-trict', bg: 'bg-teal-product-trict', fg: 'text-teal-on-primary' },
  { name: 'Twinkle accent', token: '--teal-color-product-twinkle', bg: 'bg-teal-product-twinkle', fg: 'text-teal-on-primary' },
  { name: 'Surface', token: '--teal-color-surface-container', bg: 'bg-teal-surface-container', fg: 'text-teal-on-surface' },
  { name: 'Elevated surface', token: '--teal-color-surface-container-high', bg: 'bg-teal-surface-container-high', fg: 'text-teal-on-surface' },
]

export const documentationVisualTokens = [
  { name: 'Control radius', token: '--teal-radius-control' },
  { name: 'Surface radius', token: '--teal-radius-surface' },
  { name: 'Extra-large radius', token: '--teal-radius-xl' },
  { name: 'Pill radius', token: '--teal-radius-pill' },
  { name: 'Subtle border', token: '--teal-border-subtle' },
  { name: 'Strong border', token: '--teal-border-strong' },
  { name: 'Focus ring', token: '--teal-focus-ring' },
  { name: 'Raised elevation', token: '--teal-shadow-raised' },
  { name: 'Overlay elevation', token: '--teal-shadow-overlay' },
  { name: 'Voxel bevel', token: '--teal-shadow-voxel' },
  { name: 'Extra-small icon', token: '--teal-icon-xs' },
  { name: 'Small icon', token: '--teal-icon-sm' },
  { name: 'Medium icon', token: '--teal-icon-md' },
  { name: 'Large icon', token: '--teal-icon-lg' },
  { name: 'Extra-large icon', token: '--teal-icon-xl' },
  { name: 'Fast motion', token: '--teal-motion-fast' },
  { name: 'Standard motion', token: '--teal-motion-standard' },
  { name: 'Medium motion', token: '--teal-motion-med' },
  { name: 'Slow motion', token: '--teal-motion-slow' },
  { name: 'Voxel ease', token: '--teal-motion-ease' },
]

export const contrastPairs = [
  ['teal-color-on-surface', 'teal-color-surface'],
  ['teal-color-on-surface-variant', 'teal-color-surface-variant'],
  ['teal-color-on-background', 'teal-color-background'],
  ['teal-color-on-primary', 'teal-color-primary'],
  ['teal-color-on-primary-container', 'teal-color-primary-container'],
  ['teal-color-on-primary-fixed', 'teal-color-primary-fixed'],
  ['teal-color-on-primary-fixed-variant', 'teal-color-primary-fixed-dim'],
  ['teal-color-on-secondary', 'teal-color-secondary'],
  ['teal-color-on-secondary-container', 'teal-color-secondary-container'],
  ['teal-color-on-secondary-fixed', 'teal-color-secondary-fixed'],
  ['teal-color-on-secondary-fixed-variant', 'teal-color-secondary-fixed-dim'],
  ['teal-color-on-tertiary', 'teal-color-tertiary'],
  ['teal-color-on-tertiary-container', 'teal-color-tertiary-container'],
  ['teal-color-on-tertiary-fixed', 'teal-color-tertiary-fixed'],
  ['teal-color-on-tertiary-fixed-variant', 'teal-color-tertiary-fixed-dim'],
  ['teal-color-on-error', 'teal-color-error'],
  ['teal-color-on-error-container', 'teal-color-error-container'],
  ['teal-color-inverse-on-surface', 'teal-color-inverse-surface'],
  ['teal-color-inverse-primary', 'teal-color-inverse-surface'],
]
