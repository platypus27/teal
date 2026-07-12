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
  {
    id: 'filter-toolbar',
    title: 'Filter toolbar',
    description: 'Keep search, scope, and reset actions together above a dense result surface.',
    file: 'recipe-filter-toolbar.jsx',
  },
  {
    id: 'confirmation-flow',
    title: 'Confirmation flow',
    description: 'Use a focused dialog for destructive work with an explicit recovery path.',
    file: 'recipe-confirmation-flow.jsx',
  },
  {
    id: 'empty-table',
    title: 'Empty table',
    description: 'Explain an empty collection in the same structural space where rows will appear.',
    file: 'recipe-empty-table.jsx',
  },
  {
    id: 'responsive-shell',
    title: 'Responsive application shell',
    description: 'Compose TopBar and VerticalNav into a desktop shell that can become a mobile drawer.',
    file: 'recipe-responsive-shell.jsx',
  },
  {
    id: 'disclosed-search',
    title: 'Disclosed search',
    description: 'Keep a calm toolbar until search is requested, then transfer focus into the field.',
    file: 'recipe-disclosed-search.jsx',
  },
]

export const promotionRule =
  'A recipe becomes a published module only after at least two Kryv products need the same behavior. Product persistence, validation policy, queries, and domain language stay in the application.'
