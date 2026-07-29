import { AspectRatio } from '@kryv/teal'

export function AspectRatioDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-40">
        <AspectRatio ratio={1}>
          <div className="flex size-full items-center justify-center bg-teal-surface-container-high text-sm text-teal-on-surface-variant">
            1 : 1
          </div>
        </AspectRatio>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center bg-teal-surface-container-high text-sm text-teal-on-surface-variant">
          16 : 9 media area
        </div>
      </AspectRatio>
    </div>
  )
}
