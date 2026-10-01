/** Foundation metadata is generated from the package token source. */
import tokenData from '../generated/tokens.js'

export const colorTokens = tokenData.colors
export const visualTokens = tokenData.visualTokens

export const typeTokens = [
  { token: '--teal-font-headline', label: 'Plus Jakarta Sans', className: 'font-teal-headline' },
  { token: '--teal-font-body', label: 'Manrope', className: 'font-teal-body' },
]

export const shapeNotes = [
  'Radii scale 10/14/20/28 pixels from nested inputs up to hero surfaces.',
  'Panels carry the voxel bevel: an inset top highlight over a deep ambient drop.',
  'Motion runs 160 to 600 milliseconds on one ease curve and respects reduced motion.',
]
