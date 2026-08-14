import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { Menu, type MenuItem } from '../src/Menu'

const items: MenuItem[] = [
  { id: 'rename', label: 'Rename', onSelect: vi.fn() },
  { id: 'share', label: 'Share', onSelect: vi.fn(), disabled: true },
  { id: 'delete', label: 'Delete', onSelect: vi.fn(), separatorBefore: true, variant: 'danger' },
]

describe('Menu', () => {
  it('opens from the trigger and renders all items', async () => {
    const user = userEvent.setup()
    render(<Menu label="File actions" trigger={<Button>Actions</Button>} items={items} />)

    await user.click(screen.getByRole('button', { name: 'Actions' }))

    // aria-labelledby (the trigger) wins over the content's aria-label, so the
    // menu's accessible name is the trigger's label.
    expect(await screen.findByRole('menu', { name: 'Actions' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument()
  })

  it('calls onSelect when an item is clicked and closes the menu', async () => {
    const user = userEvent.setup()
    render(<Menu label="File actions" trigger={<Button>Actions</Button>} items={items} />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))

    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }))

    expect(items[0]?.onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('renders a separator above items flagged with separatorBefore', async () => {
    const user = userEvent.setup()
    render(<Menu label="File actions" trigger={<Button>Actions</Button>} items={items} />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))

    expect(await screen.findAllByRole('separator')).toHaveLength(1)
  })

  it('does not call onSelect for disabled items', async () => {
    const user = userEvent.setup()
    render(<Menu label="File actions" trigger={<Button>Actions</Button>} items={items} />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))

    const share = await screen.findByRole('menuitem', { name: 'Share' })
    expect(share).toHaveAttribute('aria-disabled', 'true')
    await user.click(share)
    expect(items[1]?.onSelect).not.toHaveBeenCalled()
  })

  it('applies the danger text color to danger items', async () => {
    const user = userEvent.setup()
    render(<Menu label="File actions" trigger={<Button>Actions</Button>} items={items} />)
    await user.click(screen.getByRole('button', { name: 'Actions' }))

    expect(await screen.findByRole('menuitem', { name: 'Delete' })).toHaveClass('teal-u-text-error')
  })
})
