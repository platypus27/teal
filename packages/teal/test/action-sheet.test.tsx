import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionSheet, type ActionSheetAction } from '../src/ActionSheet'
import { Button } from '../src/Button'

function ControlledActionSheet({
  actions,
  onCancel,
}: {
  actions?: ActionSheetAction[]
  onCancel?: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open actions</Button>
      <ActionSheet
        open={open}
        onOpenChange={setOpen}
        title="Report options"
        actions={
          actions ?? [
            { label: 'Duplicate' },
            { label: 'Archive' },
            { label: 'Delete', destructive: true },
          ]
        }
        {...(onCancel !== undefined ? { onCancel } : {})}
      />
    </>
  )
}

describe('ActionSheet', () => {
  it('opens from its trigger and lists one button per action', async () => {
    const user = userEvent.setup()
    render(<ControlledActionSheet />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open actions' }))

    expect(screen.getByRole('dialog', { name: 'Report options' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Duplicate' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onSelect and closes when an action is chosen', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<ControlledActionSheet actions={[{ label: 'Duplicate', onSelect }]} />)

    await user.click(screen.getByRole('button', { name: 'Open actions' }))
    await user.click(screen.getByRole('button', { name: 'Duplicate' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('marks destructive actions', async () => {
    const user = userEvent.setup()
    render(<ControlledActionSheet />)

    await user.click(screen.getByRole('button', { name: 'Open actions' }))
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-destructive', 'true')
    expect(screen.getByRole('button', { name: 'Archive' })).not.toHaveAttribute('data-destructive')
  })

  it('closes via the cancel button without selecting an action', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onCancel = vi.fn()
    render(<ControlledActionSheet actions={[{ label: 'Duplicate', onSelect }]} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Open actions' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<ControlledActionSheet />)

    await user.click(screen.getByRole('button', { name: 'Open actions' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('falls back to an accessible label when no title is given', () => {
    render(<ActionSheet defaultOpen actions={[{ label: 'Duplicate' }]} />)

    expect(screen.getByRole('dialog', { name: 'Actions' })).toBeInTheDocument()
  })
})
