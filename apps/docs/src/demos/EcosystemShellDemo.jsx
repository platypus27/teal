import { Camera, ChartLine, Gauge, House, Sparkles } from 'lucide-react'
import { EcosystemShell } from '@kryv/teal'

const brand = (
  <>
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-product-home text-sm font-extrabold text-white shadow-teal-raised">
      K
    </span>
    <span
      className="w-0 overflow-hidden whitespace-nowrap font-teal-headline text-base font-extrabold tracking-tight text-teal-on-surface opacity-0 transition-all duration-200 group-hover:w-auto group-hover:opacity-100 group-focus-within:w-auto group-focus-within:opacity-100"
      aria-hidden="true"
    >
      Kryv
    </span>
  </>
)

const home = { href: '#home', label: 'Home', icon: <House className="size-5" aria-hidden="true" /> }

/** @type {import('@kryv/teal').EcosystemRailDestination[]} */
const destinations = [
  { id: 'photos', label: 'Photos', href: '#photos', icon: <Camera className="size-5" aria-hidden="true" />, current: true, status: 'healthy' },
  { id: 'yang', label: 'Yang', href: '#yang', icon: <Gauge className="size-5" aria-hidden="true" />, status: 'degraded' },
  { id: 'trict', label: 'Trict', href: '#trict', icon: <ChartLine className="size-5" aria-hidden="true" /> },
  { id: 'twinkle', label: 'Twinkle', href: '#twinkle', icon: <Sparkles className="size-5" aria-hidden="true" />, status: 'stale' },
]

export function EcosystemShellDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="h-[26rem] w-full overflow-hidden rounded-xl border border-teal-outline-variant/50">
        <EcosystemShell
          className="!h-[26rem]"
          brand={brand}
          home={{ ...home, current: true }}
          destinations={destinations.map(({ current: _current, ...destination }) => destination)}
        >
          <div className="p-6">
            <h2 className="font-teal-headline text-lg font-bold">Good morning.</h2>
            <p className="mt-1 max-w-md text-sm text-teal-on-surface-variant">
              No user, settings link, or top bar: the shell is just the rail and the main region. Resize below
              the md breakpoint and the rail folds into the Ecosystem drawer.
            </p>
          </div>
        </EcosystemShell>
      </div>
    )
  }

  return (
    <div className="h-[30rem] w-full overflow-hidden rounded-xl border border-teal-outline-variant/50">
      <EcosystemShell
        className="!h-[30rem]"
        brand={brand}
        home={home}
        destinations={destinations}
        settingsHref="#settings"
        user={{ name: 'Avery Morgan', email: 'avery@kryvlabs.com' }}
        accountItems={[{ id: 'sessions', label: 'Sessions and trusted devices', onSelect: () => {} }]}
        appSignOut={{ label: 'Sign out of Photos', onSelect: () => {} }}
        ssoSignOut={{ label: 'Sign out everywhere', onSelect: () => {} }}
        topBar={
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm font-semibold text-teal-on-surface">Library</span>
            <span className="text-xs text-teal-on-surface-variant">12,408 items</span>
          </div>
        }
      >
        <div className="space-y-3 p-6">
          <h2 className="font-teal-headline text-lg font-bold">Good morning.</h2>
          <p className="max-w-md text-sm text-teal-on-surface-variant">
            The full ecosystem chrome: brand with wordmark reveal, Home first, health dots on every
            destination, settings and account pinned to the rail footer, and a top bar slot above the
            scrolling main region.
          </p>
          <div className="grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-teal-outline-variant/40 bg-teal-surface-container-low p-4 shadow-teal-voxel">
              <p className="text-sm font-semibold">From Yang</p>
              <p className="mt-1 text-xs text-teal-on-surface-variant">Photos API recovered at 12:04</p>
            </div>
            <div className="rounded-xl border border-teal-outline-variant/40 bg-teal-surface-container-low p-4 shadow-teal-voxel">
              <p className="text-sm font-semibold">Ask Twinkle</p>
              <p className="mt-1 text-xs text-teal-on-surface-variant">“Find the beach photos from July”</p>
            </div>
          </div>
        </div>
      </EcosystemShell>
    </div>
  )
}
