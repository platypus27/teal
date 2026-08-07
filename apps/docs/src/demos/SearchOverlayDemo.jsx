import { useState } from 'react'
import { Button, SearchOverlay } from '@kryv/teal'

const pages = [
  { title: 'Getting started', section: 'Docs' },
  { title: 'Components', section: 'Docs' },
  { title: 'Foundations', section: 'Docs' },
  { title: 'Accessibility checklist', section: 'Guides' },
  { title: 'Release notes', section: 'Guides' },
]

export function SearchOverlayDemo({ exampleIndex = 0 }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const results = exampleIndex === 1 ? [] : pages.filter((page) => page.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Search the docs
      </Button>
      <span className="text-sm text-teal-on-surface-variant">
        {exampleIndex === 1 ? 'This example always renders the empty state.' : 'Type to filter, arrow keys move, Enter picks a result.'}
      </span>
      <SearchOverlay
        open={open}
        onOpenChange={setOpen}
        resultCount={results.length}
        onQueryChange={setQuery}
        onSelect={() => setOpen(false)}
        label="Search the docs"
        placeholder="Search pages…"
      >
        {({ activeIndex, listId, optionId, setActiveIndex }) =>
          results.length === 0 ? (
            <p className="py-16 text-center text-sm text-teal-on-surface-variant">No pages match “{query}”.</p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Pages" className="m-0 flex list-none flex-col gap-1 p-0">
              {results.map((page, index) => (
                <li
                  key={page.title}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setOpen(false)}
                  className={`flex cursor-default items-center justify-between rounded-lg px-4 py-3 text-sm ${
                    index === activeIndex ? 'bg-teal-primary/10 text-teal-primary' : 'text-teal-on-surface'
                  }`}
                >
                  <span>{page.title}</span>
                  <span className="text-xs text-teal-on-surface-variant">{page.section}</span>
                </li>
              ))}
            </ul>
          )
        }
      </SearchOverlay>
    </div>
  )
}
