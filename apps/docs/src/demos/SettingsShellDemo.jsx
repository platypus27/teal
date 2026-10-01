import { Button, Field, Input, SettingsShell, StepUpNotice } from '@kryv/teal'

const trictSections = [
  {
    label: 'Trict',
    items: [
      { id: 'account', label: 'Account', href: '#account' },
      { id: 'risk', label: 'Risk', href: '#risk', current: true },
      { id: 'schedule', label: 'Schedule', href: '#schedule' },
      { id: 'strategy', label: 'Strategy', href: '#strategy' },
      { id: 'ai', label: 'AI & research', href: '#ai' },
    ],
  },
  {
    label: 'Ecosystem',
    items: [{ id: 'home', label: '← Back to Home settings', href: '#home-settings' }],
  },
]

export function SettingsShellDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <SettingsShell
        accent="--teal-color-product-yang"
        title="Integrations"
        description="Services Yang watches on behalf of the household."
        sections={[
          {
            label: 'Yang',
            items: [
              { id: 'integrations', label: 'Integrations', current: true, onSelect: () => {} },
              { id: 'monitoring', label: 'Monitoring', onSelect: () => {} },
              { id: 'fleet', label: 'Fleet', onSelect: () => {} },
            ],
          },
        ]}
      >
        <p className="max-w-md text-sm text-teal-on-surface-variant">
          Items without an href render as buttons and report through onSelect — for settings pages that swap
          panels in place instead of navigating.
        </p>
      </SettingsShell>
    )
  }

  return (
    <SettingsShell
      accent="--teal-color-product-trict"
      title="Risk"
      description="Caps the execution worker enforces before any order reaches OANDA."
      sections={trictSections}
      notice={
        <StepUpNotice title="Step-up required" action={<Button size="sm">Verify to save</Button>}>
          Changing risk caps needs a fresh step-up (password + TOTP).
        </StepUpNotice>
      }
      saveBar={
        <>
          <Button size="sm">Save changes</Button>
          <Button size="sm" variant="ghost">Discard</Button>
          <span className="text-xs text-teal-on-surface-variant">Unsaved changes · autosaves drafts</span>
        </>
      }
    >
      <div className="grid max-w-md gap-4">
        <Field label="Max risk per trade">
          <Input defaultValue="1.0%" />
        </Field>
        <Field label="Max daily drawdown">
          <Input defaultValue="3.0%" />
        </Field>
        <Field label="ATR stop-loss multiplier">
          <Input defaultValue="1.5×" />
        </Field>
      </div>
    </SettingsShell>
  )
}
