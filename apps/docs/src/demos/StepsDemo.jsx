import { useState } from 'react'
import { Steps } from '@kryv/teal'

export function StepsDemo({ exampleIndex = 0 }) {
  const [current, setCurrent] = useState(1)

  if (exampleIndex === 1) {
    return (
      <Steps
        className="w-full max-w-2xl"
        current={current}
        onStepClick={setCurrent}
        steps={[
          { label: 'Account', description: 'Basic details' },
          { label: 'Workspace', description: 'Name and region' },
          { label: 'Members', description: 'Invite your team' },
          { label: 'Review', description: 'Confirm and finish' },
        ]}
      />
    )
  }

  return (
    <Steps
      className="w-full max-w-xl"
      current={2}
      steps={[{ label: 'Draft' }, { label: 'Review' }, { label: 'Approved' }, { label: 'Published' }]}
    />
  )
}
