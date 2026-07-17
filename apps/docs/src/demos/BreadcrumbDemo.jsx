import { Breadcrumb } from '@kryv/teal'

export function BreadcrumbDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Breadcrumb
        collapseAfter={3}
        items={[
          { label: 'Workspace', href: '#' },
          { label: 'Projects', href: '#' },
          { label: 'Orion', href: '#' },
          { label: 'Reports', href: '#' },
          { label: 'Quarterly review' },
        ]}
      />
    )
  }
  return (
    <Breadcrumb
      items={[
        { label: 'Workspace', href: '#' },
        { label: 'Projects', href: '#' },
        { label: 'Orion' },
      ]}
    />
  )
}
