import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { FloatingPanel } from '../src/FloatingPanel'

function ControlledFloatingPanel({ anchor }: { anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open panel</Button>
      <FloatingPanel
        open={open}
        onOpenChange={setOpen}
        {...(anchor !== undefined ? { anchor } : {})}
        title="Clipboard history"
      >
        <p>Panel body</p>
      </FloatingPanel>
    </>
  )
}

describe('FloatingPanel', () => {
  it('opens from its trigger as a non-modal dialog with an accessible name', async () => {
    const user = userEvent.setup()
    render(<ControlledFloatingPanel />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open panel' }))

    const panel = screen.getByRole('dialog', { name: 'Clipboard history' })
    expect(panel).toBeInTheDocument()
    expect(panel).not.toHaveAttribute('aria-modal')
    expect(screen.getByText('Panel body')).toBeInTheDocument()
  })

  it('closes via its close button', async () => {
    const user = userEvent.setup()
    render(<ControlledFloatingPanel />)

    await user.click(screen.getByRole('button', { name: 'Open panel' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape when focus is inside the panel', async () => {
    const user = userEvent.setup()
    render(<ControlledFloatingPanel />)

    await user.click(screen.getByRole('button', { name: 'Open panel' }))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('marks the corner it is anchored to', async () => {
    const user = userEvent.setup()
    render(<ControlledFloatingPanel anchor="top-left" />)

    await user.click(screen.getByRole('button', { name: 'Open panel' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-anchor', 'top-left')
  })

  it('renders nothing when closed and respects a controlled closed state', () => {
    render(
      <FloatingPanel open={false} onOpenChange={() => {}} title="Clipboard history">
        <p>Panel body</p>
      </FloatingPanel>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
