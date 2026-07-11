import { Switch } from '@kryv/teal'

export function SwitchDemo() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <Switch
        label="Security notifications"
        description="Receive alerts for high-risk account activity"
        defaultChecked
      />
      <Switch label="Weekly digest" />
      <Switch label="Auto-deploy previews" size="sm" defaultChecked />
      <Switch label="Billing alerts" description="Managed by your administrator" disabled />
    </div>
  )
}
