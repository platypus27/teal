import { Gauge } from 'lucide-react'
import { EcosystemBrand, EcosystemShell } from '@kryv/teal'

const home = { href: '#home', label: 'Home' }

/** @type {import('@kryv/teal').EcosystemRailDestination[]} */
const destinations = [
  { id: 'photos', label: 'Photos', href: '#photos', current: true, status: 'healthy' },
  { id: 'yang', label: 'Yang', href: '#yang', status: 'degraded' },
  { id: 'trict', label: 'Trict', href: '#trict' },
  { id: 'twinkle', label: 'Twinkle', href: '#twinkle', status: 'stale' },
]

export function EcosystemShellDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="h-[26rem] w-full overflow-hidden rounded-xl border border-teal-outline-variant/50">
        <EcosystemShell
          className="!h-[26rem]"
          brand={<EcosystemBrand alt="Kryv Photos" />}
          home={{ ...home, current: true }}
          destinations={[
            { id: 'yang', label: 'Yang', href: '#yang', icon: <Gauge aria-hidden="true" /> },
          ]}
        >
          <div className="p-6 md:pl-24">
            <h2 className="font-teal-headline text-lg font-bold">Good morning.</h2>
            <p className="mt-1 max-w-md text-sm text-teal-on-surface-variant">
              The escape hatches: an explicit brand replaces the default EcosystemBrand, and an explicit
              per-item icon wins over the catalog glyph. No user, settings link, or top bar: the shell is
              just the rail and the main region. Resize below the md breakpoint and the rail folds into the
              Ecosystem drawer.
            </p>
          </div>
        </EcosystemShell>
      </div>
    )
  }

  return (
    <div className="h-[36rem] w-full overflow-hidden rounded-xl border border-teal-outline-variant/50">
      <EcosystemShell
        className="!h-[36rem]"
        home={home}
        destinations={destinations}
        settingsHref="#settings"
        user={{ name: 'Avery Morgan', email: 'avery@kryvlabs.com' }}
        accountItems={[{ id: 'sessions', label: 'Sessions and trusted devices', onSelect: () => {} }]}
        appSignOut={{ label: 'Sign out of Photos', onSelect: () => {} }}
        ssoSignOut={{ label: 'Sign out everywhere', onSelect: () => {} }}
        topBar={
          <div className="flex items-center justify-between px-4 py-2.5 md:pl-24">
            <span className="text-sm font-semibold text-teal-on-surface">Library</span>
            <span className="text-xs text-teal-on-surface-variant">12,408 items</span>
          </div>
        }
      >
        <div className="space-y-3 p-6 md:pl-24">
          <h2 className="font-teal-headline text-lg font-bold">Good morning.</h2>
          <p className="max-w-md text-sm text-teal-on-surface-variant">
            The full ecosystem chrome with zero per-app wiring: the default EcosystemBrand with its wordmark
            reveal, canonical catalog icons resolved from each destination id, health dots on every
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
