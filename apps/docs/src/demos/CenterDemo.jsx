import { Center } from '@kryv/teal'

export function CenterDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <p className="text-sm text-teal-on-surface-variant">
        Inline centering keeps flow intact:{' '}
        <Center inline className="size-6 rounded-full bg-teal-primary align-middle">
          <span className="text-xs font-bold text-teal-on-primary">3</span>
        </Center>{' '}
        unread conversations.
      </p>
    )
  }

  return (
    <Center className="h-32 w-full rounded-xl border border-dashed border-teal-outline-variant/60">
      <span className="rounded-lg bg-teal-surface-container-high px-3 py-1 text-sm">Centered both ways</span>
    </Center>
  )
}
