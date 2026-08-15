import { useState } from 'react'
import { Input, TextArea } from '@kryv/teal'

export function InputDemo({ exampleIndex = 0 }) {
  const [query, setQuery] = useState('')

  if (exampleIndex === 5) {
    return (
      <div className="grid w-full max-w-xs gap-4">
        <Input
          type="password"
          label="Password"
          description="Use at least 12 characters"
          autoComplete="new-password"
        />
        <Input type="password" label="Current password" autoComplete="current-password" />
      </div>
    )
  }

  if (exampleIndex === 4) {
    return (
      <div className="grid w-full max-w-md gap-4">
        <Input
          clearable
          label="Search projects"
          description="Results update as you type"
          placeholder="Type a project name"
          value={query}
          onValueChange={setQuery}
        />
        <Input clearable label="Loading results" defaultValue="Design review" loading />
        <Input clearable label="Archived projects" placeholder="Unavailable" disabled />
      </div>
    )
  }

  if (exampleIndex === 3) {
    return (
      <div className="grid w-full max-w-md gap-4">
        <Input clearable size="sm" label="Filter files" placeholder="Type to filter" />
        <Input
          label="Workspace slug"
          defaultValue="not a slug"
          aria-invalid="true"
          description="Use lowercase letters, numbers, and dashes only."
        />
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="grid w-full max-w-md gap-6">
        <TextArea autosize label="Bio" placeholder="Tell us about yourself" />
        <TextArea autosize label="Notes" minRows={3} maxRows={8} placeholder="Starts at three rows" />
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-4">
        <Input aria-label="Email address" type="email" placeholder="name@company.com" autoComplete="email" />
        <Input aria-label="Mobile number" type="tel" inputMode="tel" placeholder="+1 555 010 2299" autoComplete="tel" />
        <TextArea aria-label="Release notes" placeholder="One change per line" rows={5} />
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-md gap-4">
      <Input aria-label="Search projects" placeholder="Search projects" />
      <Input aria-label="Email address" defaultValue="not-an-email" aria-invalid="true" />
      <Input aria-label="Disabled input" placeholder="Disabled input" disabled />
      <TextArea aria-label="Team update" placeholder="Write a short update for the team" />
    </div>
  )
}
