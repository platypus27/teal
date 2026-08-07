import { Flex } from '@kryv/teal'

const tags = ['Design', 'Engineering', 'Research', 'Support']

export function FlexDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <Flex direction="column" gap={2} align="start" className="w-full">
        {tags.map((tag) => (
          <span key={tag} className="rounded-lg bg-teal-surface-container px-3 py-1 text-sm">
            {tag}
          </span>
        ))}
      </Flex>
    )
  }

  return (
    <Flex gap={3} wrap align="center" justify="between" className="w-full">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-teal-outline-variant/50 px-3 py-1 text-sm">
          {tag}
        </span>
      ))}
    </Flex>
  )
}
