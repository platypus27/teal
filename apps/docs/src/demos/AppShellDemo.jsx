import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, AppShellSidebar } from '@kryv/teal'

export function AppShellDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <AppShell className="h-56 w-full overflow-hidden rounded-xl border border-teal-outline-variant/50">
        <AppShellHeader className="px-4 py-3">
          <p className="text-sm font-semibold">Docs</p>
        </AppShellHeader>
        <AppShellMain className="p-4 text-sm text-teal-on-surface-variant">
          No sidebar: the main region spans the full width.
        </AppShellMain>
      </AppShell>
    )
  }

  return (
    <AppShell className="h-64 w-full overflow-hidden rounded-xl border border-teal-outline-variant/50">
      <AppShellHeader className="px-4 py-3">
        <p className="text-sm font-semibold">Acme Console</p>
      </AppShellHeader>
      <AppShellSidebar width={160} className="p-3 text-sm text-teal-on-surface-variant">
        <p>Overview</p>
        <p className="mt-2">Reports</p>
        <p className="mt-2">Settings</p>
      </AppShellSidebar>
      <AppShellMain className="p-4 text-sm text-teal-on-surface-variant">
        Main content area
      </AppShellMain>
      <AppShellFooter className="px-4 py-2 text-xs text-teal-on-surface-variant">
        v2.4.0
      </AppShellFooter>
    </AppShell>
  )
}
