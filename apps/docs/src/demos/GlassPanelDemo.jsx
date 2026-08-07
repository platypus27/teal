import { GlassPanel } from '@kryv/teal'

export function GlassPanelDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-teal-400 via-sky-400 to-indigo-400 p-10">
        <GlassPanel className="text-center">
          <p className="text-sm font-semibold">Floating over imagery</p>
          <p className="mt-1 text-sm text-gray-600">
            The backdrop blur keeps content readable on busy or colorful backgrounds.
          </p>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-teal-400 via-sky-400 to-indigo-400 p-10">
      <GlassPanel>
        <p className="text-sm font-semibold">Signed in as Mina</p>
        <p className="mt-1 text-sm text-gray-600">
          A frosted surface with a translucent background, border highlight, and soft overlay shadow.
        </p>
      </GlassPanel>
    </div>
  )
}
