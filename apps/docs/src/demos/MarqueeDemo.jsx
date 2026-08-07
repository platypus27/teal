import { Marquee } from '@kryv/teal'

const statuses = ['All systems operational', 'Deploy v2.4 complete', 'Latency down 12%', '3 new regions live']

const tools = ['Figma', 'Storybook', 'Tailwind', 'Radix', 'Vitest', 'Vite']

export function MarqueeDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Marquee direction="right" duration={14} className="w-80 rounded-xl border border-gray-200 py-2">
        {tools.map((tool) => (
          <span key={tool} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {tool}
          </span>
        ))}
      </Marquee>
    )
  }

  return (
    <Marquee className="w-96 rounded-xl border border-gray-200 py-2">
      {statuses.map((status) => (
        <span key={status} className="flex items-center gap-2 text-sm text-gray-700">
          <span className="inline-block size-2 rounded-full bg-teal-500" aria-hidden="true" />
          {status}
        </span>
      ))}
    </Marquee>
  )
}
