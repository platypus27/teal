import { MentionInput } from '@kryv/teal'

const people = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'alan', label: 'Alan Turing' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'katherine', label: 'Katherine Johnson' },
]

export function MentionInputDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-md">
        <MentionInput
          label="Handoff notes"
          defaultValue={'Follow up with @Grace Hopper about the rollout.'}
          options={people}
          rows={4}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <MentionInput
        label="Comment"
        placeholder="Type @ to mention a teammate…"
        options={people}
      />
    </div>
  )
}
