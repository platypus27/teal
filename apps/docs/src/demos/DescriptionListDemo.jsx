import { DescriptionList } from '@kryv/teal'

export function DescriptionListDemo({ exampleIndex = 0 }) {
  const project = [
    { label: 'Owner', value: 'Avery Stone' },
    { label: 'Status', value: 'Active' },
    { label: 'Visibility', value: 'Workspace' },
    { label: 'Created', value: 'Mar 4, 2026' },
  ]

  if (exampleIndex === 1) {
    return (
      <DescriptionList
        layout="grid"
        className="w-full max-w-2xl"
        items={[
          ...project,
          { label: 'Members', value: '12' },
          { label: 'Storage used', value: '4.2 GB' },
        ]}
      />
    )
  }

  return <DescriptionList className="w-full max-w-sm" items={project} />
}
