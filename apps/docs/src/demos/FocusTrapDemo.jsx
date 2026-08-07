import { useState } from 'react'
import { Button, FocusTrap, Input } from '@kryv/teal'

export function FocusTrapDemo({ exampleIndex = 0 }) {
  const [active, setActive] = useState(false)

  if (exampleIndex === 1) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Button variant="secondary" onClick={() => setActive((value) => !value)}>
          {active ? 'Release the signup form trap' : 'Trap focus in the signup form'}
        </Button>
        <FocusTrap active={active} className="flex w-72 flex-col gap-3 rounded-xl border border-gray-200 p-4">
          <Input aria-label="First name" placeholder="First name" />
          <Input aria-label="Last name" placeholder="Last name" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Save</Button>
          </div>
        </FocusTrap>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setActive((value) => !value)}>{active ? 'Release focus trap' : 'Activate focus trap'}</Button>
      <FocusTrap active={active} className="flex w-72 flex-col gap-3 rounded-xl border border-gray-200 p-4">
        <Input aria-label="Project name" placeholder="Project name" />
        <div className="flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button>Create</Button>
        </div>
      </FocusTrap>
      <p className="text-sm text-gray-500">{active ? 'Tab cycles inside the panel.' : 'Trap inactive — Tab moves freely.'}</p>
    </div>
  )
}
