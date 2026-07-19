/** Foundation metadata is generated from the package token source. */
import tokenData from '../generated/tokens.js'

export const colorTokens = tokenData.colors
export const visualTokens = tokenData.visualTokens

export const typeTokens = [
  { token: '--teal-font-headline', label: 'Plus Jakarta Sans', className: 'font-headline' },
  { token: '--teal-font-body', label: 'Manrope', className: 'font-body' },
]

export const shapeNotes = [
  'Controls use 12 to 16 pixel radii.',
  'Surfaces use soft teal elevation.',
  'Motion stays between 150 and 200 milliseconds and respects reduced motion.',
]
