/**
 * Recipe metadata shared by RecipesPage and the Markdown generators. The page
 * attaches the live component and ?raw source; build scripts read `file`.
 */

export const recipes = [
  {
    id: 'settings',
    title: 'Settings section',
    description: 'Use this composition for related settings with one save action.',
    file: 'recipe-settings.jsx',
  },
  {
    id: 'review-queue',
    title: 'Review queue',
    description:
      'Combine a structural card, semantic status, and a responsive table for operational review surfaces.',
    file: 'recipe-review-queue.jsx',
  },
]

export const promotionRule =
  'A recipe becomes a published module only after at least two Kryv products need the same behavior. Product persistence, validation policy, queries, and domain language stay in the application.'
