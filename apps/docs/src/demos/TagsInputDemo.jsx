import { useState } from 'react'
import { TagsInput } from '@kryv/teal'

export function TagsInputDemo({ exampleIndex = 0 }) {
  const [tags, setTags] = useState(['design', 'accessibility'])
  const [reviewers, setReviewers] = useState(['avery'])

  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-2">
        <TagsInput label="Add reviewer" value={reviewers} onChange={setReviewers} max={3} placeholder="Add a reviewer…" />
        <span className="text-sm text-teal-on-surface-variant">At most three reviewers are allowed.</span>
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-2">
      <TagsInput label="Add label" value={tags} onChange={setTags} placeholder="Add a label…" />
      <span className="text-sm text-teal-on-surface-variant">Press Enter or comma to add; Backspace removes the last tag.</span>
    </div>
  )
}
