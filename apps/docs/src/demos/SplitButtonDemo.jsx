import { useState } from 'react'
import { SplitButton } from '@kryv/teal'

export function SplitButtonDemo({ exampleIndex = 0 }) {
  const [message, setMessage] = useState('')

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-3">
        <SplitButton
          label="Save draft"
          variant="secondary"
          onClick={() => setMessage('Draft saved')}
          items={[
            { id: 'save-exit', label: 'Save and exit', onSelect: () => setMessage('Saved and exited') },
            { id: 'discard', label: 'Discard draft', variant: 'danger', separatorBefore: true, onSelect: () => setMessage('Draft discarded') },
          ]}
        />
        {message ? <p className="text-sm text-on-surface-variant">{message}</p> : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <SplitButton
        label="Deploy"
        onClick={() => setMessage('Deploying to production')}
        items={[
          { id: 'staging', label: 'Deploy to staging', onSelect: () => setMessage('Deploying to staging') },
          { id: 'preview', label: 'Create preview deployment', onSelect: () => setMessage('Creating preview deployment') },
          { id: 'schedule', label: 'Schedule deployment', separatorBefore: true, onSelect: () => setMessage('Deployment scheduled') },
        ]}
      />
      {message ? <p className="text-sm text-on-surface-variant">{message}</p> : null}
    </div>
  )
}
