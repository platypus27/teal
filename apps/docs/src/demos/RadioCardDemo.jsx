import { RadioCard } from '@kryv/teal'
import { Building2, Rocket, Sparkles } from 'lucide-react'

export function RadioCardDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <RadioCard
        className="w-full max-w-3xl"
        label="Choose a plan"
        orientation="horizontal"
        defaultValue="pro"
        options={[
          { value: 'starter', title: 'Starter', description: 'For side projects', icon: <Sparkles /> },
          { value: 'pro', title: 'Pro', description: 'For growing teams', icon: <Rocket /> },
          { value: 'enterprise', title: 'Enterprise', description: 'For large orgs', icon: <Building2 /> },
        ]}
      />
    )
  }

  return (
    <RadioCard
      className="w-full max-w-md"
      label="Billing period"
      defaultValue="yearly"
      options={[
        { value: 'monthly', title: 'Monthly', description: 'Pay as you go, cancel anytime' },
        { value: 'yearly', title: 'Yearly', description: 'Two months free, billed once a year' },
        { value: 'lifetime', title: 'Lifetime', description: 'Currently unavailable', disabled: true },
      ]}
    />
  )
}
