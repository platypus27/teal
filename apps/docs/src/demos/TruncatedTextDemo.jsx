import { TruncatedText } from '@kryv/teal'

const paragraph =
  'The quarterly accessibility audit covered every surface in the admin console. It found improved focus visibility across dialogs, more consistent naming for icon-only buttons, and a remaining gap in chart descriptions that the data team will address next sprint.'

export function TruncatedTextDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-96 rounded-xl border border-gray-200 p-4">
        <TruncatedText text={paragraph} lines={3} />
      </div>
    )
  }

  return (
    <div className="w-64 rounded-xl border border-gray-200 p-4">
      <TruncatedText text={paragraph} />
    </div>
  )
}
