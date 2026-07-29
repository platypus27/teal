import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { Drawer } from '../src/Drawer'

function ControlledDrawer({ side }: { side?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        {...(side !== undefined ? { side } : {})}
        title="Project details"
        description="Orion workspace — updated 2 hours ago"
        footer={<Button variant="secondary">Done</Button>}
      >
        <p>Drawer body</p>
      </Drawer>
    </>
  )
}

describe('Drawer', () => {
  it('opens from its trigger and presents the title and body', async () => {
    const user = userEvent.setup()
    render(<ControlledDrawer />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open drawer' }))

    expect(screen.getByRole('dialog', { name: 'Project details' })).toBeInTheDocument()
    expect(screen.getByText('Drawer body')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<ControlledDrawer />)

    await user.click(screen.getByRole('button', { name: 'Open drawer' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes via its close button', async () => {
    const user = userEvent.setup()
    render(<ControlledDrawer />)

    await user.click(screen.getByRole('button', { name: 'Open drawer' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('marks the edge it is anchored to', async () => {
    const user = userEvent.setup()
    render(<ControlledDrawer side="left" />)

    await user.click(screen.getByRole('button', { name: 'Open drawer' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left')
  })
})
