import { useState } from 'react'
import { ArrowRight, Blocks, Keyboard, PackageCheck, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, CardDescription, CardTitle, Dialog, Field, Input, Switch, Table, Tabs, toast } from '@kryv/teal'
import { CodeBlock } from '../components/CodeBlock.jsx'
import { Page, Section } from '../components/Page.jsx'
import { catalogGroups } from '../data/docs-module-registry.js'
import { installSteps, packageManagers, principles } from '../data/getting-started.js'
import { gettingStartedMarkdown } from '../lib/markdown.js'

const principleIcons = {
  quiet: Palette,
  keyboard: Keyboard,
  interface: PackageCheck,
  recipes: Blocks,
}

function Step({ number, title, description = undefined, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
          {number}
        </span>
        <h3 className="font-headline font-bold text-on-surface">{title}</h3>
      </div>
      {description ? <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p> : null}
      {children}
    </div>
  )
}

function PreviewDialog() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Preview dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Unsaved changes" description="Review the values before leaving this workspace.">
        <p className="text-sm text-on-surface-variant">The dialog owns focus, dismissal, and the close action.</p>
      </Dialog>
    </>
  )
}

export function HomePage() {
  return (
    <Page
      eyebrow="Kryv Labs"
      title="A calm, accessible system for serious product work"
      docTitle="Getting started"
      description="Teal provides typed React modules, semantic design tokens, and tested interaction behavior for Kryv applications."
      markdown={gettingStartedMarkdown()}
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/modules/button">
            Explore modules <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/foundations">Read foundations</Link>
        </Button>
      </div>

      <Section title="Principles">
        <div className="grid gap-4 md:grid-cols-2">
          {principles.map(({ id, title, text }) => {
            const Icon = principleIcons[id]
            return (
              <Card key={title}>
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="mt-2">{text}</CardDescription>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section
        title="A real product surface"
        description="Teal primitives are designed to compose into calm, information-dense workflows without hiding product behavior."
      >
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-outline-variant/30 px-5 py-4">
              <div>
                <CardTitle>Review queue</CardTitle>
                <CardDescription className="mt-1">Three items need a decision today.</CardDescription>
              </div>
              <Badge variant="warning">Needs review</Badge>
            </div>
            <Table
              caption="Review queue"
              rows={[
                { id: 'orion', title: 'Suspicious sign-in cluster', owner: 'Avery', priority: 'Critical' },
                { id: 'atlas', title: 'External integration request', owner: 'Morgan', priority: 'Medium' },
              ]}
              getRowKey={(row) => row.id}
              columns={[
                { key: 'title', header: 'Item', cell: (row) => <span className="font-medium">{row.title}</span> },
                { key: 'owner', header: 'Owner', cell: (row) => row.owner },
                { key: 'priority', header: 'Priority', cell: (row) => <Badge variant={row.priority === 'Critical' ? 'danger' : 'warning'}>{row.priority}</Badge> },
              ]}
            />
          </Card>
          <Card>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription className="mt-2">A form seam keeps labels, help text, and state together.</CardDescription>
            <div className="mt-5 grid gap-4">
              <Field label="Workspace name" description="Shown in the global navigation">
                <Input defaultValue="Project Orion" />
              </Field>
              <Switch label="Review reminders" description="Send a daily summary to owners" defaultChecked />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast({ title: 'Settings saved', variant: 'success' })}>Save settings</Button>
                <PreviewDialog />
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="Installation"
        description="Teal ships as a single package with compiled styles and a Tailwind preset. It works in any React 18 or 19 app with Tailwind CSS 3.4."
      >
        <div className="space-y-8">
          {installSteps.map((step, index) => (
            <Step key={step.title} number={index + 1} title={step.title} description={step.description}>
              {step.kind === 'packageManagers' ? (
                <Tabs
                  aria-label="Package manager"
                  items={packageManagers.map(({ value, label, code }) => ({
                    value,
                    label,
                    content: <CodeBlock code={code} lang="bash" label={label} />,
                  }))}
                />
              ) : (
                <CodeBlock code={step.code} lang={step.lang} label={step.label} />
              )}
            </Step>
          ))}
        </div>
      </Section>

      <Section
        title="Modules"
        description="Twenty-two typed modules across seven groups. Each page ships live examples, a playground, a generated interface reference, and keyboard documentation."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalogGroups.flatMap((group) =>
            group.modules.map((module) => (
              <Link
                key={module.id}
                to={`/modules/${module.id}`}
                className="group flex flex-col gap-2 rounded-2xl border border-outline-variant/30 bg-surface-container p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {group.name}
                </span>
                <span className="flex items-center justify-between gap-2 font-headline font-bold text-on-surface">
                  {module.name}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-on-surface-variant transition group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </span>
                <span className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                  {module.description}
                </span>
              </Link>
            )),
          )}
        </div>
      </Section>
    </Page>
  )
}
