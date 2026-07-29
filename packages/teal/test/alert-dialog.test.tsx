import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertDialog } from '../src/AlertDialog'

function setup(props: Partial<Parameters<typeof AlertDialog>[0]> = {}) {
  return render(
    <AlertDialog
      title="Delete project?"
      description="This permanently removes the project and its deployments."
      trigger={<button type="button">Delete</button>}
      {...props}
    />,
  )
}

describe('AlertDialog', () => {
  it('opens on trigger click and shows title and description', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup()

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument()
    expect(screen.getByText('This permanently removes the project and its deployments.')).toBeInTheDocument()
  })

  it('calls onConfirm and closes when the confirm button is pressed', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onConfirm = vi.fn()
    setup({ onConfirm })

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Confirm' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })

  it('calls onCancel and closes when the cancel button is pressed', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    setup({ onCancel, onConfirm })

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })

  it('uses custom button labels', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup({ cancelText: 'Keep it', confirmText: 'Yes, delete' })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('button', { name: 'Keep it' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument()
  })

  it('styles the confirm button as destructive in the danger tone', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup({ tone: 'danger' })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('button', { name: 'Confirm' })).toHaveClass('teal-u-bg-error')
  })

  it('renders custom actions instead of the default buttons', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup({ actions: <button type="button">Custom action</button> })

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('button', { name: 'Custom action' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('supports controlled open state', () => {
    setup({ open: true, onOpenChange: vi.fn() })

    expect(screen.getByRole('alertdialog', { name: 'Delete project?' })).toBeInTheDocument()
  })
})
