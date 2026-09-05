import { ShareButton } from '@kryv/teal'

export function ShareButtonDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="flex items-center gap-6">
        <ShareButton
          url="https://teal.kryvlabs.com/modules/share-button"
          title="ShareButton — Teal"
          variant="ghost"
          size="sm"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <ShareButton url="https://teal.kryvlabs.com" title="Teal design system" />
    </div>
  )
}
