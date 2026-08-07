import { SaveStatus } from '@kryv/teal'

const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000)

export function SaveStatusDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col gap-3">
        <SaveStatus savedAt={threeMinutesAgo} />
        <SaveStatus savedAt={new Date()} formatSavedAt={(date) => date.toLocaleTimeString()} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <SaveStatus status="saved" savedAt={new Date()} />
      <SaveStatus status="saving" />
      <SaveStatus status="error" />
    </div>
  )
}
