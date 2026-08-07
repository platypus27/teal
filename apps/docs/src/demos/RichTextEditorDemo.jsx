import { RichTextEditor } from '@kryv/teal'

export function RichTextEditorDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-2xl">
        <RichTextEditor
          label="Release notes"
          preview
          defaultValue={'## Highlights\n\n- Faster sync for **large workspaces**\n- Read the [migration guide](https://example.com)'}
          rows={6}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <RichTextEditor
        label="Update summary"
        placeholder="Write markdown…"
        defaultValue="The toolbar formats the *current selection*."
        rows={6}
      />
    </div>
  )
}
