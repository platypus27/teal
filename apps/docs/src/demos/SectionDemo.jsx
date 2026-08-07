import { Section } from '@kryv/teal'

export function SectionDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full space-y-2">
        <Section spacing="sm" className="rounded-xl bg-teal-surface-container px-4">
          <p className="text-sm">Compact rhythm (spacing=&quot;sm&quot;)</p>
        </Section>
        <Section spacing="lg" className="rounded-xl bg-teal-surface-container px-4">
          <p className="text-sm">Generous rhythm (spacing=&quot;lg&quot;)</p>
        </Section>
      </div>
    )
  }

  return (
    <Section container spacing="md" className="w-full rounded-xl bg-teal-surface-container-low">
      <h3 className="font-semibold text-teal-on-surface">Release notes</h3>
      <p className="mt-1 text-sm text-teal-on-surface-variant">
        Section content is centered in a container with medium vertical rhythm.
      </p>
    </Section>
  )
}
