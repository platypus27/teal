import { Input, TextArea } from '@kryv/teal'

export function InputDemo() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <Input aria-label="Search projects" placeholder="Search projects" />
      <Input aria-label="Email address" defaultValue="not-an-email" aria-invalid="true" />
      <Input aria-label="Disabled input" placeholder="Disabled input" disabled />
      <TextArea aria-label="Team update" placeholder="Write a short update for the team" />
    </div>
  )
}
