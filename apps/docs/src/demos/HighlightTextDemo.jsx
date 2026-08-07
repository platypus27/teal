import { HighlightText } from '@kryv/teal'

const results = [
  'Audit report for Q3',
  'Reporter onboarding checklist',
  'Annual compliance report archive',
]

export function HighlightTextDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <ul className="w-80 divide-y divide-gray-100 rounded-xl border border-gray-200">
        {results.map((result) => (
          <li key={result} className="px-4 py-3 text-sm">
            <HighlightText text={result} query="report" />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p className="w-96 text-sm text-gray-700">
      <HighlightText
        text="The design system tokens cover color, spacing, motion, and elevation. Color tokens follow Material 3 roles."
        query="tokens"
      />
    </p>
  )
}
