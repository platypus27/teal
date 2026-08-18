import { TextArea } from '@kryv/teal'

export function TextAreaDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 2) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <TextArea
          autosize
          label="Release notes"
          description="Grows up to four rows, then scrolls."
          maxRows={4}
          defaultValue={'Shipped dark mode.\nFixed the date picker.\nPolished the empty states.'}
        />
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <TextArea autosize label="Bio" placeholder="Tell us about yourself" />
        <TextArea autosize label="Notes" minRows={3} maxRows={8} placeholder="Starts at three rows" />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-4">
      <TextArea label="Team update" placeholder="Write a short update for the team" />
      <TextArea
        label="Release notes"
        defaultValue="Shipped dark mode"
        aria-invalid="true"
        description="Summarize one change per line."
        rows={4}
      />
      <TextArea label="Archived notes" placeholder="Unavailable" disabled />
    </div>
  )
}
