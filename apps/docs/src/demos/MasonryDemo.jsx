import { Masonry } from '@kryv/teal'

const notes = [
  { title: 'Roadmap draft', lines: 2 },
  { title: 'Interview notes', lines: 5 },
  { title: 'Launch checklist', lines: 3 },
  { title: 'Retro summary', lines: 6 },
  { title: 'Open questions', lines: 2 },
  { title: 'Metrics review', lines: 4 },
]

function NoteCard({ title, lines }) {
  return (
    <div className="rounded-xl border border-teal-outline-variant/50 p-3">
      <p className="text-sm font-semibold text-teal-on-surface">{title}</p>
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="mt-2 h-2 rounded bg-teal-surface-container-high" style={{ width: `${90 - index * 12}%` }} />
      ))}
    </div>
  )
}

export function MasonryDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Masonry minColumnWidth="10rem" gap={3} className="w-full">
        {notes.map((note) => (
          <NoteCard key={note.title} {...note} />
        ))}
      </Masonry>
    )
  }

  return (
    <Masonry columns={3} gap={3} className="w-full">
      {notes.map((note) => (
        <NoteCard key={note.title} {...note} />
      ))}
    </Masonry>
  )
}
