import { useState } from 'react'
import { SearchInput } from '@kryv/teal'

export function SearchInputDemo({ exampleIndex = 0 }) {
  const [query, setQuery] = useState('')

  if (exampleIndex === 2) {
    return (
      <SearchInput
        label="Search invoices"
        description="Results refresh as you type"
        placeholder="Type an invoice number"
        defaultValue="INV-2049"
        loading
        className="w-full max-w-md"
      />
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-md gap-4">
        <SearchInput
          label="Search projects"
          description="Results update as you type"
          placeholder="Type a project name"
          defaultValue="Quarterly report"
          onClear={() => undefined}
        />
        <SearchInput label="Loading results" defaultValue="Design review" loading />
        <SearchInput label="Archived projects" placeholder="Unavailable" disabled />
      </div>
    )
  }
  return (
    <SearchInput
      label="Search projects"
      description="Matches project names and descriptions"
      placeholder="Type to filter projects"
      value={query}
      onValueChange={setQuery}
      onClear={() => undefined}
      className="w-full max-w-md"
    />
  )
}
