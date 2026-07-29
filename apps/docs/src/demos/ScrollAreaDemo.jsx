import { ScrollArea } from '@kryv/teal'

const lists = [
  [
    'Avery Stone',
    'Blake Moreno',
    'Casey Nguyen',
    'Devon Patel',
    'Emery Kim',
    'Finley Ortiz',
    'Gray Lindqvist',
    'Harper Adeyemi',
    'Indigo Sato',
    'Jordan Ellis',
  ],
  [
    'Orion redesign',
    'Billing migration',
    'Mobile shell',
    'Reporting v2',
    'Access reviews',
    'Onboarding flow',
    'API gateway',
    'Design tokens',
    'Audit logging',
    'Search indexing',
  ],
]

export function ScrollAreaDemo({ exampleIndex = 0 }) {
  const items = lists[exampleIndex % lists.length]
  return (
    <ScrollArea maxHeight={220} className="w-72 rounded-xl border border-teal-outline-variant/40">
      <ul className="divide-y divide-teal-outline-variant/40">
        {items.map((item) => (
          <li key={item} className="px-4 py-2.5 text-sm text-teal-on-surface">
            {item}
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
