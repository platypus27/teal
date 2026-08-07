import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { FullscreenDialog } from '../src/FullscreenDialog'

function ControlledFullscreenDialog() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open editor</Button>
      <FullscreenDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit report"
        description="Changes are saved when you leave this screen."
        footer={<Button variant="secondary">Done</Button>}
      >
        <p>Editor body</p>
      </FullscreenDialog>
    </>
  )
}

describe('FullscreenDialog', () => {
  it('opens from its trigger and presents the title and body', async () => {
    const user = userEvent.setup()
    render(<ControlledFullscreenDialog />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open editor' }))

    expect(screen.getByRole('dialog', { name: 'Edit report' })).toBeInTheDocument()
    expect(screen.getByText('Editor body')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<ControlledFullscreenDialog />)

    await user.click(screen.getByRole('button', { name: 'Open editor' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes via the header close button', async () => {
    const user = userEvent.setup()
    render(<ControlledFullscreenDialog />)

    await user.click(screen.getByRole('button', { name: 'Open editor' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders immediately when defaultOpen is set', () => {
    render(
      <FullscreenDialog defaultOpen title="Edit report">
        <p>Editor body</p>
      </FullscreenDialog>,
    )

    expect(screen.getByRole('dialog', { name: 'Edit report' })).toBeInTheDocument()
  })
})
