import { ArrowRight, Blocks, Keyboard, PackageCheck, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kryv/teal'
import { Page, Section } from '../components/Page.jsx'

const principles = [
  { icon: Palette, title: 'Quiet by default', text: 'Surface, type, and spacing create hierarchy. Color is reserved for action and meaning.' },
  { icon: Keyboard, title: 'Keyboard complete', text: 'Every interactive module has visible focus and a complete keyboard path.' },
  { icon: PackageCheck, title: 'One supported interface', text: 'Applications import typed modules and compiled styles from @kryv/teal.' },
  { icon: Blocks, title: 'Recipes before abstractions', text: 'Product patterns remain recipes until repeated behavior proves a stable module seam.' },
]

export function HomePage() {
  return (
    <Page
      eyebrow="Kryv Labs"
      title="A calm, accessible system for serious product work"
      description="Teal provides typed React modules, semantic design tokens, and tested interaction behavior for Kryv applications."
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild><Link to="/modules/button">Explore modules <ArrowRight /></Link></Button>
        <Button asChild variant="secondary"><Link to="/foundations">Read foundations</Link></Button>
      </div>
      <Section title="Principles">
        <div className="grid gap-4 md:grid-cols-2">
          {principles.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4" />
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Install">
        <pre className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container p-5 font-mono text-sm text-on-surface"><code>npm install @kryv/teal</code></pre>
        <pre className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container p-5 font-mono text-sm text-on-surface"><code>{`import '@kryv/teal/styles.css'\nimport { Button, Field, Input } from '@kryv/teal'`}</code></pre>
      </Section>
    </Page>
  )
}
