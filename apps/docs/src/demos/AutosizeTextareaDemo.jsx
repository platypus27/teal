import { AutosizeTextarea } from '@kryv/teal'

export function AutosizeTextareaDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <AutosizeTextarea
          label="Release notes"
          description="Grows up to four rows, then scrolls."
          maxRows={4}
          defaultValue={'Shipped dark mode.\nFixed the date picker.\nPolished the empty states.'}
        />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-6">
      <AutosizeTextarea label="Bio" placeholder="Tell us about yourself" />
      <AutosizeTextarea label="Notes" minRows={3} maxRows={8} placeholder="Starts at three rows" />
    </div>
  )
}
