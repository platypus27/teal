import { RadioGroup } from '@kryv/teal'
import { Building2, Rocket, Sparkles } from 'lucide-react'

export function RadioGroupDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <RadioGroup
        label="Digest frequency"
        orientation="horizontal"
        defaultValue="weekly"
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]}
      />
    )
  }
  if (exampleIndex === 2) {
    return (
      <RadioGroup
        variant="card"
        className="w-full max-w-3xl"
        label="Choose a plan"
        orientation="horizontal"
        defaultValue="pro"
        options={[
          { value: 'starter', label: 'Starter', description: 'For side projects', icon: <Sparkles /> },
          { value: 'pro', label: 'Pro', description: 'For growing teams', icon: <Rocket /> },
          { value: 'enterprise', label: 'Enterprise', description: 'For large orgs', icon: <Building2 /> },
        ]}
      />
    )
  }
  return (
    <RadioGroup
      label="Project visibility"
      description="Choose who can open this project"
      defaultValue="team"
      options={[
        { value: 'private', label: 'Private', description: 'Only invited members can view' },
        { value: 'team', label: 'Team', description: 'Everyone in the workspace can view' },
        { value: 'public', label: 'Public', description: 'Available after launch review', disabled: true },
      ]}
    />
  )
}
