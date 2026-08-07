import { ExpandableCard } from '@kryv/teal'

export function ExpandableCardDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xl">
        <ExpandableCard
          title="Keyboard shortcuts"
          defaultExpanded
          expandLabel="View shortcuts"
          collapseLabel="Hide shortcuts"
        >
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Ctrl + K — open the command palette</li>
            <li>Ctrl + / — toggle the sidebar</li>
            <li>Esc — close the current dialog</li>
          </ul>
        </ExpandableCard>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl">
      <ExpandableCard title="Release notes">
        <p className="text-sm text-gray-600">
          Version 2.4 adds dark surface tokens, improves focus ring contrast, and fixes drawer scroll locking. The
          full migration guide is available in the changelog.
        </p>
      </ExpandableCard>
    </div>
  )
}
