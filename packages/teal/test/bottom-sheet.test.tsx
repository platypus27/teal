import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BottomSheet } from '../src/BottomSheet'
import { Button } from '../src/Button'

function ControlledBottomSheet({ snap }: { snap?: 'half' | 'full' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        {...(snap !== undefined ? { snap } : {})}
        title="Share report"
        description="Choose who gets access"
        footer={<Button variant="secondary">Done</Button>}
      >
        <p>Sheet body</p>
      </BottomSheet>
    </>
  )
}

describe('BottomSheet', () => {
  it('opens from its trigger and presents the title and body', async () => {
    const user = userEvent.setup()
    render(<ControlledBottomSheet />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open sheet' }))

    expect(screen.getByRole('dialog', { name: 'Share report' })).toBeInTheDocument()
    expect(screen.getByText('Sheet body')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<ControlledBottomSheet />)

    await user.click(screen.getByRole('button', { name: 'Open sheet' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes via its close button', async () => {
    const user = userEvent.setup()
    render(<ControlledBottomSheet />)

    await user.click(screen.getByRole('button', { name: 'Open sheet' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('marks the snap height it is anchored to', async () => {
    const user = userEvent.setup()
    render(<ControlledBottomSheet snap="full" />)

    await user.click(screen.getByRole('button', { name: 'Open sheet' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-snap', 'full')
  })

  it('defaults to the half snap height', async () => {
    const user = userEvent.setup()
    render(<ControlledBottomSheet />)

    await user.click(screen.getByRole('button', { name: 'Open sheet' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-snap', 'half')
  })
})
