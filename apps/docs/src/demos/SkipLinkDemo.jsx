import { SkipLink } from '@kryv/teal'

export function SkipLinkDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="relative h-24 w-full overflow-hidden rounded-xl border border-teal-outline-variant/30 p-4">
        <SkipLink href="#demo-content">Skip to main content</SkipLink>
        <p id="demo-content" className="pt-8 text-sm text-teal-on-surface-variant">
          Press Tab to reveal the skip link, then Enter to jump here.
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-24 w-full overflow-hidden rounded-xl border border-teal-outline-variant/30 p-4">
      <SkipLink />
      <p id="main" className="pt-8 text-sm text-teal-on-surface-variant">
        Press Tab to reveal the skip link, then Enter to jump here.
      </p>
    </div>
  )
}
