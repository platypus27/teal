/**
 * Getting-started content shared by HomePage and the Markdown generators.
 */

export const principles = [
  {
    id: 'quiet',
    title: 'Quiet by default',
    text: 'Surface, type, and spacing create hierarchy. Color is reserved for action and meaning.',
  },
  {
    id: 'keyboard',
    title: 'Keyboard complete',
    text: 'Every interactive module has visible focus and a complete keyboard path.',
  },
  {
    id: 'interface',
    title: 'One supported interface',
    text: 'Applications import typed modules and compiled styles from @kryv/teal.',
  },
  {
    id: 'recipes',
    title: 'Recipes before abstractions',
    text: 'Product patterns remain recipes until repeated behavior proves a stable module seam.',
  },
]

export const packageManagers = [
  { value: 'npm', label: 'npm', code: 'npm install @kryv/teal' },
  { value: 'pnpm', label: 'pnpm', code: 'pnpm add @kryv/teal' },
  { value: 'yarn', label: 'yarn', code: 'yarn add @kryv/teal' },
  { value: 'bun', label: 'bun', code: 'bun add @kryv/teal' },
]

const tailwindConfig = `import tealPreset from '@kryv/teal/tailwind-preset'

/** @type {import('tailwindcss').Config} */
export default {
  ...tealPreset,
  content: ['./index.html', './src/**/*.{ts,tsx}'],
}`

const stylesImport = `import '@kryv/teal/styles.css'`

const baseStylesImport = `import '@kryv/teal/base.css'`

const fontsMarkup = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
  rel="stylesheet"
/>`

const themeSnippet = `// Teal themes by toggling the "dark" class on <html>.
document.documentElement.classList.toggle('dark', darkMode)`

const usageSnippet = `import { Button, Field, Input } from '@kryv/teal'

export function SignInForm() {
  return (
    <form className="grid gap-4">
      <Field label="Email" required>
        <Input type="email" />
      </Field>
      <Button type="submit">Sign in</Button>
    </form>
  )
}`

export const installSteps = [
  {
    title: 'Install the package',
    description: 'React 18 or 19 is required as a peer dependency.',
    kind: 'packageManagers',
  },
  {
    title: 'Import the styles',
    description:
      'Import the compiled component styles once at your app entry. Teal modules do not require Tailwind in the consuming application.',
    code: stylesImport,
    lang: 'js',
    label: 'main.jsx',
  },
  {
    title: 'Optionally apply document defaults',
    description:
      'base.css applies Teal typography, body colors, selection, and scrollbar defaults. Skip it when the application already owns document-level styling.',
    code: baseStylesImport,
    lang: 'js',
    label: 'main.jsx',
  },
  {
    title: 'Optionally configure Tailwind 3',
    description:
      'Use the preset only when application markup needs Teal semantic utilities such as bg-teal-surface-container or text-teal-on-surface-variant.',
    code: tailwindConfig,
    lang: 'js',
    label: 'tailwind.config.js',
  },
  {
    title: 'Load the fonts',
    description:
      'Teal typesets headlines in Plus Jakarta Sans and body copy in Manrope. Add the Google Fonts links to your document head.',
    code: fontsMarkup,
    lang: 'html',
    label: 'index.html',
  },
  {
    title: 'Enable dark mode',
    description:
      'Tokens switch themes when the dark class is present on the html element. Persist the choice however your app prefers.',
    code: themeSnippet,
    lang: 'js',
    label: 'theme.js',
  },
  {
    title: 'Build something',
    code: usageSnippet,
    lang: 'jsx',
    label: 'SignInForm.jsx',
  },
]
