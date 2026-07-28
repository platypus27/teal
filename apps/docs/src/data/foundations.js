/** Foundation metadata is generated from the package token source. */
import { authentikVersion } from '../../../../packages/teal/authentik-source.mjs'
import tokenData from '../generated/tokens.js'

export const colorTokens = tokenData.colors
export const visualTokens = tokenData.visualTokens

export const authentikAdapter = {
  version: authentikVersion,
  exportName: '@kryv/teal/authentik.css',
  regenerate: 'npm run generate:authentik',
  notes: [
    `Apply the generated file as brand Custom CSS; pinned to Authentik ${authentikVersion}.`,
    'Covers color, typography, radii, elevation, focus, light and dark, and reduced motion through supported Authentik and PatternFly variables only.',
    'Brand logo, favicon, background, and app icons are brand settings in Authentik, not CSS.',
    'Never edit the generated file or target private shadow-DOM structure.',
    'Upgrade procedure: bump authentikVersion in packages/teal/authentik-source.mjs, regenerate, then verify the reference flow screenshots (login, WebAuthn, recovery, consent, denial; light, dark, reduced-motion, phone, desktop) before rollout.',
  ],
}

export const typeTokens = [
  { token: '--teal-font-headline', label: 'Plus Jakarta Sans', className: 'font-teal-headline' },
  { token: '--teal-font-body', label: 'Manrope', className: 'font-teal-body' },
]

export const shapeNotes = [
  'Controls use 12 to 16 pixel radii.',
  'Surfaces use soft teal elevation.',
  'Motion stays between 150 and 200 milliseconds and respects reduced motion.',
]
