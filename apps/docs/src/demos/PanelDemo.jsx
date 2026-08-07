import { Button, Panel } from '@kryv/teal'

export function PanelDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <Panel>
          <p className="text-sm text-gray-600">
            A plain panel groups related content with a border and padding, without a header or heavy elevation.
          </p>
        </Panel>
        <Panel
          actions={
            <Button size="sm" variant="ghost">
              Edit
            </Button>
          }
        >
          <p className="text-sm text-gray-600">Actions can sit on the header row even when there is no title.</p>
        </Panel>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl">
      <Panel
        title="Storage usage"
        actions={
          <Button size="sm" variant="ghost">
            Manage
          </Button>
        }
      >
        <p className="text-sm text-gray-600">
          You have used 6.2 GB of your 10 GB quota. Older backups are archived automatically.
        </p>
      </Panel>
    </div>
  )
}
