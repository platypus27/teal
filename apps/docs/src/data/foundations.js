/**
 * Foundation token data shared by FoundationsPage and the Markdown generators.
 */

export const colorTokens = [
  { name: 'Primary', token: '--color-primary', bg: 'bg-primary', fg: 'text-on-primary' },
  { name: 'Success', token: '--color-tertiary', bg: 'bg-tertiary', fg: 'text-on-tertiary' },
  { name: 'Warning', token: '--color-warning', bg: 'bg-warning', fg: 'text-black' },
  { name: 'Danger', token: '--color-error', bg: 'bg-error', fg: 'text-on-error' },
  { name: 'Surface', token: '--color-surface-container', bg: 'bg-surface-container', fg: 'text-on-surface' },
  {
    name: 'Elevated surface',
    token: '--color-surface-container-high',
    bg: 'bg-surface-container-high',
    fg: 'text-on-surface',
  },
]

export const typeTokens = [
  { token: '--teal-font-headline', label: 'Plus Jakarta Sans', className: 'font-headline' },
  { token: '--teal-font-body', label: 'Manrope', className: 'font-body' },
]

export const shapeNotes = [
  'Controls use 12 to 16 pixel radii.',
  'Surfaces use soft teal elevation.',
  'Motion stays between 150 and 200 milliseconds and respects reduced motion.',
]
