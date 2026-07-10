import { Page, Section } from '../components/Page.jsx'
import { CodeBlock } from '../components/CodeBlock.jsx'

const submodule = `git submodule add /mnt/fast/git-repos/teal teal   # or a git URL once hosted
git submodule update --init --remote`

const tailwind = `import tealPreset from './teal/tailwind.preset.js'

export default {
  presets: [tealPreset],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', './teal/ui/**/*.{js,jsx}'],
}`

const css = `// src/main.jsx (or your global stylesheet)
import '../teal/global.css'`

const usage = `import { Button, Card, CardTitle } from '../teal/ui'

<Card>
  <CardTitle>Hello</CardTitle>
  <Button>Go</Button>
</Card>`

export function GettingStarted() {
  return (
    <Page
      title="Getting Started"
      description="teal is Kryv Labs' shared React design system — a Minimal Teal (Material 3) colour system, a Tailwind preset, and a small set of UI primitives. It is consumed as a git submodule today; npm publishing is on the roadmap."
    >
      <Section title="1. Add the submodule">
        <CodeBlock code={submodule} />
      </Section>

      <Section title="2. Wire the Tailwind preset">
        <CodeBlock code={tailwind} />
      </Section>

      <Section title="3. Import the global CSS">
        <CodeBlock code={css} />
      </Section>

      <Section title="4. Use a component">
        <CodeBlock code={usage} />
      </Section>

      <Section title="Requirements in the consuming app">
        <ul className="list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
          <li>React 18+ and Tailwind 3.4+.</li>
          <li>
            Load the fonts <span className="font-semibold text-on-surface">Plus Jakarta Sans</span> and{' '}
            <span className="font-semibold text-on-surface">Manrope</span>.
          </li>
          <li>
            Load <span className="font-semibold text-on-surface">Material Symbols Outlined</span> for icons.
          </li>
          <li>
            Dark mode: toggle the <code className="monotype rounded bg-surface-container px-1 py-0.5 text-xs">dark</code>{' '}
            class on <code className="monotype rounded bg-surface-container px-1 py-0.5 text-xs">&lt;html&gt;</code>.
          </li>
        </ul>
      </Section>
    </Page>
  )
}
