import { OfflineBanner } from '@kryv/teal'

export function OfflineBannerDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return <OfflineBanner message="Connection lost — retrying in the background" dismissLabel="Hide message" />
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <OfflineBanner />
      <p className="text-black/60">Toggle your network connection to see the banner appear.</p>
    </div>
  )
}
