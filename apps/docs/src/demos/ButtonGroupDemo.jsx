import { useState } from 'react'
import { Button, ButtonGroup, Toggle } from '@kryv/teal'

const rangeOptions = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

export function ButtonGroupDemo({ exampleIndex = 0 }) {
  const [range, setRange] = useState('week')

  if (exampleIndex === 1) {
    return (
      <ButtonGroup orientation="vertical">
        <Button variant="secondary">Project settings</Button>
        <Button variant="secondary">Members</Button>
        <Button variant="secondary">Danger zone</Button>
      </ButtonGroup>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <ButtonGroup aria-label="Date range">
        {rangeOptions.map((option) => (
          <Toggle
            key={option.id}
            pressed={range === option.id}
            onPressedChange={() => setRange(option.id)}
          >
            {option.label}
          </Toggle>
        ))}
      </ButtonGroup>
      <p className="text-sm text-teal-on-surface-variant">
        The selected option pops with an accent fill. For single-select toolbars with a sliding
        indicator, see SegmentedControl.
      </p>
    </div>
  )
}
