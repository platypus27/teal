import { Reveal } from '@kryv/teal'

const cards = [
  { title: 'Reliability', body: 'Error budget steady at 98.2% this quarter.' },
  { title: 'Adoption', body: '42 teams now ship with the design system.' },
  { title: 'Performance', body: 'Median page weight down 18% year over year.' },
]

export function RevealDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex gap-4">
        {cards.map((card) => (
          <Reveal key={card.title} once={false} className="w-52 rounded-xl border border-gray-200 p-4">
            <p className="font-medium">{card.title}</p>
            <p className="mt-1 text-sm text-gray-500">{card.body}</p>
          </Reveal>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      {cards.map((card) => (
        <Reveal key={card.title} className="w-52 rounded-xl border border-gray-200 p-4">
          <p className="font-medium">{card.title}</p>
          <p className="mt-1 text-sm text-gray-500">{card.body}</p>
        </Reveal>
      ))}
    </div>
  )
}
