import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Copy, Trash2 } from 'lucide-react'
import { ContextMenu, type ContextMenuItem } from '../src/ContextMenu'

function makeItems(): ContextMenuItem[] {
  return [
    { id: 'copy', label: 'Copy link', icon: <Copy />, onSelect: vi.fn() },
    { id: 'archive', label: 'Archive', onSelect: vi.fn(), disabled: true },
    { id: 'delete', label: 'Delete', icon: <Trash2 />, onSelect: vi.fn(), separatorBefore: true, variant: 'danger' },
  ]
}

function setup(items = makeItems()) {
  render(
    <ContextMenu items={items} label="File actions">
      <div data-testid="target">report.pdf</div>
    </ContextMenu>,
  )
  return items
}

describe('ContextMenu', () => {
  it('opens on right-click and renders all items', async () => {
    setup()

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    fireEvent.contextMenu(screen.getByTestId('target'))

    expect(await screen.findByRole('menu', { name: 'File actions' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Copy link/ })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  })

  it('renders icons for items that provide one', async () => {
    setup()
    fireEvent.contextMenu(screen.getByTestId('target'))

    const copy = await screen.findByRole('menuitem', { name: /Copy link/ })
    expect(copy.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a separator above items flagged with separatorBefore', async () => {
    setup()
    fireEvent.contextMenu(screen.getByTestId('target'))

    expect((await screen.findAllByRole('separator'))).toHaveLength(1)
  })

  it('calls onSelect when an item is clicked and closes the menu', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const items = setup()
    fireEvent.contextMenu(screen.getByTestId('target'))

    await user.click(await screen.findByRole('menuitem', { name: /Copy link/ }))

    expect(items[0]?.onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('does not call onSelect for disabled items', async () => {
    const items = setup()
    fireEvent.contextMenu(screen.getByTestId('target'))

    const archive = await screen.findByRole('menuitem', { name: 'Archive' })
    expect(archive).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(archive)

    expect(items[1]?.onSelect).not.toHaveBeenCalled()
  })
})
