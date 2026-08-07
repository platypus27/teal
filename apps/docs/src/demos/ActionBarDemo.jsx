import { ActionBar, Button } from '@kryv/teal'

export function ActionBarDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-solid border-gray-200">
        <ActionBar position="top" label="Document actions">
          <Button variant="ghost" size="sm">
            Discard
          </Button>
          <Button variant="secondary" size="sm">
            Save draft
          </Button>
        </ActionBar>
        <div className="p-4 text-sm text-gray-600">
          A top-positioned bar keeps page-level actions visible above the content they affect.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border border-solid border-gray-200">
      <div className="p-4 text-sm text-gray-600">
        The sticky bar below stays pinned to the bottom of the editing surface while the form scrolls.
      </div>
      <ActionBar sticky label="Edit actions">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save changes
        </Button>
      </ActionBar>
    </div>
  )
}
