import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popconfirm } from '../src/Popconfirm'

function setup(props: Partial<Parameters<typeof Popconfirm>[0]> = {}) {
  return render(
    <Popconfirm
      title="Discard changes?"
      message="Unsaved edits will be lost."
      trigger={<button type="button">Discard</button>}
      {...props}
    />,
  )
}

describe('Popconfirm', () => {
  it('opens on trigger click and shows the title and message', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup()

    expect(screen.queryByText('Discard changes?')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Discard' }))

    expect(await screen.findByText('Discard changes?')).toBeInTheDocument()
    expect(screen.getByText('Unsaved edits will be lost.')).toBeInTheDocument()
  })

  it('calls onConfirm and closes when the confirm button is pressed', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onConfirm = vi.fn()
    setup({ onConfirm })

    await user.click(screen.getByRole('button', { name: 'Discard' }))
    await user.click(await screen.findByRole('button', { name: 'Confirm' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByText('Discard changes?')).not.toBeInTheDocument())
  })

  it('calls onCancel and closes when the cancel button is pressed', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    setup({ onCancel, onConfirm })

    await user.click(screen.getByRole('button', { name: 'Discard' }))
    await user.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByText('Discard changes?')).not.toBeInTheDocument())
  })

  it('styles the confirm button as destructive in the danger tone', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup({ tone: 'danger' })

    await user.click(screen.getByRole('button', { name: 'Discard' }))

    expect(await screen.findByRole('button', { name: 'Confirm' })).toHaveClass('teal-u-bg-error')
  })

  it('uses custom button labels', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup({ cancelText: 'Keep', confirmText: 'Yes, discard' })

    await user.click(screen.getByRole('button', { name: 'Discard' }))

    expect(await screen.findByRole('button', { name: 'Keep' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Yes, discard' })).toBeInTheDocument()
  })

  it('supports controlled open state and reports open changes', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onOpenChange = vi.fn()
    const onConfirm = vi.fn()
    setup({ open: true, onOpenChange, onConfirm })

    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
