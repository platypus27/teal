import { VirtualList } from '@kryv/teal'

const people = Array.from({ length: 500 }, (_, index) => ({
  name: `Teammate ${index + 1}`,
  role: ['Designer', 'Engineer', 'Researcher', 'Writer'][index % 4],
}))

export function VirtualListDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <VirtualList
        items={people}
        itemHeight={48}
        height={240}
        label="Teammates with detail"
        className="w-80 rounded-xl border border-gray-200"
        renderItem={(person, index) => (
          <div className="flex h-full items-center justify-between px-4 odd:bg-gray-50">
            <span className="text-sm font-medium">{person.name}</span>
            <span className="text-xs text-gray-500">
              {person.role} · #{index + 1}
            </span>
          </div>
        )}
      />
    )
  }

  return (
    <VirtualList
      items={people}
      itemHeight={32}
      height={224}
      label="Teammates"
      className="w-72 rounded-xl border border-gray-200"
      renderItem={(person) => <div className="flex h-full items-center px-4 text-sm">{person.name}</div>}
    />
  )
}
