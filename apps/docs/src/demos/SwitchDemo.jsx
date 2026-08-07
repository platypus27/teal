import { useState } from 'react'
import { Switch } from '@kryv/teal'

export function SwitchDemo({ exampleIndex = 0 }) {
  const [alerts, setAlerts] = useState(true)
  const [summary, setSummary] = useState(false)

  if (exampleIndex === 3) {
    return (
      <div className="grid w-full max-w-sm gap-3">
        <Switch label="Launch at login" size="sm" defaultChecked />
        <Switch label="Show in menu bar" size="sm" />
        <Switch label="Play sounds" size="sm" />
        <Switch label="Auto-lock" size="sm" disabled />
      </div>
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="grid w-full max-w-sm gap-4 rounded-2xl border border-teal-outline-variant/30 bg-teal-surface-container p-4">
        <Switch label="Automatic updates" description="Install new versions as they ship" defaultChecked />
        <Switch label="Background sync" description="Keep offline files current" />
        <Switch label="Usage statistics" description="Share anonymous usage data" />
      </div>
    )
  }

  if (exampleIndex === 1) {
    return (
      <div className="grid w-full max-w-sm gap-5">
        <Switch
          label="Email alerts"
          description="Delivered as events happen"
          checked={alerts}
          onCheckedChange={setAlerts}
        />
        <Switch
          label="Weekly summary"
          description="Requires email alerts"
          checked={alerts && summary}
          disabled={!alerts}
          onCheckedChange={setSummary}
        />
      </div>
    )
  }

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
