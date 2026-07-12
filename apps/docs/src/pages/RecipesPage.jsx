import { ExampleBlock } from '../components/ExampleBlock.jsx'
import { Page, Section } from '../components/Page.jsx'
import { recipes, promotionRule } from '../data/recipes.js'
import { ReviewQueueRecipe } from '../demos/recipe-review-queue.jsx'
import reviewQueueSource from '../demos/recipe-review-queue.jsx?raw'
import { SettingsRecipe } from '../demos/recipe-settings.jsx'
import settingsSource from '../demos/recipe-settings.jsx?raw'
import { FilterToolbarRecipe } from '../demos/recipe-filter-toolbar.jsx'
import filterToolbarSource from '../demos/recipe-filter-toolbar.jsx?raw'
import { ConfirmationFlowRecipe } from '../demos/recipe-confirmation-flow.jsx'
import confirmationFlowSource from '../demos/recipe-confirmation-flow.jsx?raw'
import { EmptyTableRecipe } from '../demos/recipe-empty-table.jsx'
import emptyTableSource from '../demos/recipe-empty-table.jsx?raw'
import { ResponsiveShellRecipe } from '../demos/recipe-responsive-shell.jsx'
import responsiveShellSource from '../demos/recipe-responsive-shell.jsx?raw'
import { DisclosedSearchRecipe } from '../demos/recipe-disclosed-search.jsx'
import disclosedSearchSource from '../demos/recipe-disclosed-search.jsx?raw'
import { recipesMarkdown } from '../lib/markdown.js'

const recipeContent = {
  settings: { Recipe: SettingsRecipe, source: settingsSource },
  'review-queue': { Recipe: ReviewQueueRecipe, source: reviewQueueSource },
  'filter-toolbar': { Recipe: FilterToolbarRecipe, source: filterToolbarSource },
  'confirmation-flow': { Recipe: ConfirmationFlowRecipe, source: confirmationFlowSource },
  'empty-table': { Recipe: EmptyTableRecipe, source: emptyTableSource },
  'responsive-shell': { Recipe: ResponsiveShellRecipe, source: responsiveShellSource },
  'disclosed-search': { Recipe: DisclosedSearchRecipe, source: disclosedSearchSource },
}

export function RecipesPage() {
  const markdown = recipesMarkdown(
    recipes.map((recipe) => ({
      title: recipe.title,
      description: recipe.description,
      source: recipeContent[recipe.id].source,
    })),
  )

  return (
    <Page
      title="Recipes"
      eyebrow="Patterns"
      description="Recipes demonstrate product composition without expanding the supported package interface prematurely."
      markdown={markdown}
    >
      {recipes.map((recipe) => {
        const { Recipe, source } = recipeContent[recipe.id]
        return (
          <Section key={recipe.id} title={recipe.title} description={recipe.description}>
            <ExampleBlock source={source}>
              <Recipe />
            </ExampleBlock>
          </Section>
        )
      })}
      <Section title="Promotion rule">
        <p className="max-w-3xl rounded-2xl border border-outline-variant/30 bg-surface-container p-5 text-sm leading-relaxed text-on-surface-variant">
          {promotionRule}
        </p>
      </Section>
    </Page>
  )
}
