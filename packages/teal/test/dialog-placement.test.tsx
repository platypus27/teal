import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { Dialog } from '../src/Dialog'

function ControlledDialog(props: Partial<React.ComponentProps<typeof Dialog>>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Share report" {...props}>
        Body content
      </Dialog>
    </>
  )
}

describe('Dialog placements', () => {
  it('opens fullscreen and closes via the header close button', async () => {
    const user = userEvent.setup()
    render(<ControlledDialog placement="fullscreen" title="Edit report" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Edit report' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('marks the edge a drawer is anchored to', async () => {
    const user = userEvent.setup()
    render(<ControlledDialog placement="left" title="Project details" />)

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('dialog', { name: 'Project details' })).toHaveAttribute('data-side', 'left')
  })

  it('marks the snap height of a bottom sheet and defaults to half', async () => {
    const user = userEvent.setup()
    render(<ControlledDialog placement="bottom" snap="full" />)

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Share report' })).toHaveAttribute('data-snap', 'full')
  })

  it('defaults a bottom sheet to the half snap height', async () => {
    const user = userEvent.setup()
    render(<ControlledDialog placement="bottom" />)

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('dialog', { name: 'Share report' })).toHaveAttribute('data-snap', 'half')
  })

  it('gives an untitled sheet an accessible name', async () => {
    const user = userEvent.setup()
    render(<ControlledDialog placement="bottom" title={undefined} />)

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeInTheDocument()
  })
})
