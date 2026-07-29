import { Rating } from '@kryv/teal'

export function RatingDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <Rating readOnly value={4} aria-label="Rated 4 out of 5" />
        <Rating readOnly value={3} size="sm" aria-label="Rated 3 out of 5" />
        <Rating readOnly value={5} size="lg" aria-label="Rated 5 out of 5" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <Rating label="Rate this report" defaultValue={3} />
      <Rating label="Rate the onboarding" defaultValue={4} size="lg" />
    </div>
  )
}
