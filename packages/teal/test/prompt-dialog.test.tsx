import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { PromptDialog } from '../src/PromptDialog'

function ControlledPromptDialog({
  onSubmit,
  onCancel,
}: {
  onSubmit?: (value: string) => void
  onCancel?: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Rename</Button>
      <PromptDialog
        open={open}
        onOpenChange={setOpen}
        title="Rename report"
        description="The new name appears everywhere the report is shared."
        label="Report name"
        defaultValue="Q3 revenue"
        confirmLabel="Rename"
        {...(onSubmit !== undefined ? { onSubmit } : {})}
        {...(onCancel !== undefined ? { onCancel } : {})}
      />
    </>
  )
}

describe('PromptDialog', () => {
  it('opens with a labeled input showing the default value', async () => {
    const user = userEvent.setup()
    render(<ControlledPromptDialog />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Rename' }))

    expect(screen.getByRole('dialog', { name: 'Rename report' })).toBeInTheDocument()
    expect(screen.getByLabelText('Report name')).toHaveValue('Q3 revenue')
  })

  it('returns the entered value on confirm and closes', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ControlledPromptDialog onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Rename' }))
    const input = screen.getByLabelText('Report name')
    await user.clear(input)
    await user.type(input, 'Q4 forecast')
    await user.click(screen.getByRole('button', { name: 'Rename' }))

    expect(onSubmit).toHaveBeenCalledWith('Q4 forecast')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('submits the value when Enter is pressed in the input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ControlledPromptDialog onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Rename' }))
    const input = screen.getByLabelText('Report name')
    await user.clear(input)
    await user.type(input, 'Draft{Enter}')

    expect(onSubmit).toHaveBeenCalledWith('Draft')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onCancel without submitting when cancelled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    render(<ControlledPromptDialog onSubmit={onSubmit} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Rename' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape without submitting', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ControlledPromptDialog onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Rename' }))
    await user.keyboard('{Escape}')

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
