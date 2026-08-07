import { TreeGrid } from '@kryv/teal'

export function TreeGridDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <TreeGrid
        aria-label="Quarterly budget"
        columns={[
          { key: 'team', label: 'Team' },
          { key: 'budget', label: 'Budget' },
          { key: 'spent', label: 'Spent' },
        ]}
        defaultExpandedIds={['eng']}
        rows={[
          {
            id: 'eng',
            team: 'Engineering',
            budget: '$240k',
            spent: '$171k',
            children: [
              { id: 'fe', team: 'Frontend', budget: '$120k', spent: '$88k' },
              { id: 'be', team: 'Backend', budget: '$120k', spent: '$83k' },
            ],
          },
          { id: 'design', team: 'Design', budget: '$90k', spent: '$41k' },
        ]}
      />
    )
  }

  return (
    <TreeGrid
      aria-label="Project files"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'size', label: 'Size' },
        { key: 'modified', label: 'Modified' },
      ]}
      rows={[
        {
          id: 'src',
          name: 'src',
          size: '—',
          modified: 'Today',
          children: [
            { id: 'app', name: 'app.ts', size: '2 KB', modified: 'Today' },
            { id: 'index', name: 'index.ts', size: '1 KB', modified: 'Yesterday' },
          ],
        },
        {
          id: 'docs',
          name: 'docs',
          size: '—',
          modified: 'Last week',
          children: [{ id: 'guide', name: 'guide.md', size: '12 KB', modified: 'Last week' }],
        },
        { id: 'pkg', name: 'package.json', size: '3 KB', modified: 'Today' },
      ]}
    />
  )
}
