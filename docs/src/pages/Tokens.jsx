import { Page, Section } from '../components/Page.jsx'

const GROUPS = [
  {
    title: 'Surfaces',
    tokens: [
      ['background', '--color-background'],
      ['surface', '--color-surface'],
      ['surface-container', '--color-surface-container'],
      ['surface-container-low', '--color-surface-container-low'],
      ['surface-container-high', '--color-surface-container-high'],
      ['surface-container-highest', '--color-surface-container-highest'],
      ['surface-variant', '--color-surface-variant'],
      ['surface-dim', '--color-surface-dim'],
    ],
  },
  {
    title: 'Brand',
    tokens: [
      ['primary', '--color-primary'],
      ['on-primary', '--color-on-primary'],
      ['primary-container', '--color-primary-container'],
      ['on-primary-container', '--color-on-primary-container'],
      ['secondary', '--color-secondary'],
      ['secondary-container', '--color-secondary-container'],
      ['tertiary', '--color-tertiary'],
      ['tertiary-container', '--color-tertiary-container'],
    ],
  },
  {
    title: 'Text',
    tokens: [
      ['on-surface', '--color-on-surface'],
      ['on-surface-variant', '--color-on-surface-variant'],
      ['on-background', '--color-on-background'],
      ['on-secondary', '--color-on-secondary'],
      ['inverse-on-surface', '--color-inverse-on-surface'],
    ],
  },
  {
    title: 'Status & lines',
    tokens: [
      ['error', '--color-error'],
      ['error-container', '--color-error-container'],
      ['on-error-container', '--color-on-error-container'],
      ['outline', '--color-outline'],
      ['outline-variant', '--color-outline-variant'],
    ],
  },
]

function Swatch({ name, varName }) {
  return (
    <div className="space-y-1.5">
      <div
        className="h-14 rounded-xl border border-outline-variant/40"
        style={{ backgroundColor: `rgb(var(${varName}))` }}
      />
      <div className="monotype text-xs font-semibold text-on-surface">{name}</div>
      <div className="monotype text-[10px] text-on-surface-variant">{varName}</div>
    </div>
  )
}

export function Tokens() {
  return (
    <Page
      title="Tokens & Colours"
      description="Colour is defined as RGB-triplet CSS variables in tokens.css, with a light set on :root and a dark set under html.dark. The Tailwind preset maps them to utilities like bg-primary and text-on-surface. Toggle dark mode in the sidebar to see every value update live."
    >
      {GROUPS.map((g) => (
        <Section key={g.title} title={g.title}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {g.tokens.map(([name, varName]) => (
              <Swatch key={name} name={name} varName={varName} />
            ))}
          </div>
        </Section>
      ))}
    </Page>
  )
}
