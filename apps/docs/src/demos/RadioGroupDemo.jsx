import { RadioGroup } from '@kryv/teal'

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
