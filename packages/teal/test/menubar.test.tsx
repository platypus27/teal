import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menubar, type MenubarMenu } from '../src/Menubar'

function makeMenus(): MenubarMenu[] {
  return [
    {
      label: 'File',
      items: [
        { id: 'new', label: 'New file', onSelect: vi.fn() },
        { id: 'share', label: 'Share', onSelect: vi.fn(), disabled: true },
        { id: 'close', label: 'Close window', onSelect: vi.fn(), separatorBefore: true },
      ],
    },
    {
      label: 'Edit',
      items: [{ id: 'undo', label: 'Undo', onSelect: vi.fn() }],
    },
  ]
}

function setup(menus = makeMenus()) {
  render(<Menubar label="Application" menus={menus} />)
  return menus
}

describe('Menubar', () => {
  it('renders a menubar with a trigger per menu', () => {
    setup()

    expect(screen.getByRole('menubar', { name: 'Application' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'File' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
  })

  it('opens a menu on trigger click and shows its items', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup()

    await user.click(screen.getByRole('menuitem', { name: 'File' }))

    expect(await screen.findByRole('menuitem', { name: 'New file' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Close window' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Undo' })).not.toBeInTheDocument()
  })

  it('calls onSelect when an item is clicked and closes the menu', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const menus = setup()

    await user.click(screen.getByRole('menuitem', { name: 'File' }))
    await user.click(await screen.findByRole('menuitem', { name: 'New file' }))

    expect(menus[0]?.items[0]?.onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('renders separators and marks disabled items', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    setup()

    await user.click(screen.getByRole('menuitem', { name: 'File' }))

    expect((await screen.findAllByRole('separator'))).toHaveLength(1)
    expect(screen.getByRole('menuitem', { name: 'Share' })).toHaveAttribute('aria-disabled', 'true')
  })
})
