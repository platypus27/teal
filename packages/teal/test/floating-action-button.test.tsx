import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pencil } from 'lucide-react'
import { FloatingActionButton } from '../src/FloatingActionButton'

describe('FloatingActionButton', () => {
  it('renders a button with an accessible label and a default plus icon', () => {
    render(<FloatingActionButton label="Create item" />)

    expect(screen.getByRole('button', { name: 'Create item' })).toBeInTheDocument()
  })

  it('is fixed to the requested corner', () => {
    render(<FloatingActionButton label="Create item" position="top-left" />)

    const button = screen.getByRole('button', { name: 'Create item' })
    expect(button.className).toContain('teal-u-fixed')
    expect(button.className).toContain('teal-u-top-6')
    expect(button.className).toContain('teal-u-left-6')
  })

  it('shows the extended label text when provided', () => {
    render(<FloatingActionButton label="Create item" extendedLabel="Create" />)

    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('renders a custom icon', () => {
    render(<FloatingActionButton label="Edit" icon={<Pencil data-testid="pencil" />} />)

    expect(screen.getByTestId('pencil')).toBeInTheDocument()
  })

  it('shows a tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<FloatingActionButton label="Create item" tooltip="Add a new item" />)

    await user.hover(screen.getByRole('button', { name: 'Create item' }))
    expect(await screen.findByRole('tooltip', { name: 'Add a new item' })).toBeInTheDocument()
  })

  it('forwards onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<FloatingActionButton label="Create item" onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Create item' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('FloatingActionButton actions fan-out', () => {
  const actions = [
    { label: 'Copy link', onClick: vi.fn() },
    { label: 'Share by email', onClick: vi.fn() },
    { label: 'Download', onClick: vi.fn() },
  ]

  it('renders a collapsed trigger with menu semantics', () => {
    render(<FloatingActionButton label="Share" actions={actions} />)
    const trigger = screen.getByRole('button', { name: 'Share' })

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('expands on click and moves focus to the first action', async () => {
    const user = userEvent.setup()
    render(<FloatingActionButton label="Share" actions={actions} />)

    await user.click(screen.getByRole('button', { name: 'Share' }))

    const items = await screen.findAllByRole('menuitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveFocus()
  })

  it('moves between actions with arrow keys and wraps around', async () => {
    const user = userEvent.setup()
    render(<FloatingActionButton label="Share" actions={actions} />)
    await user.click(screen.getByRole('button', { name: 'Share' }))
    const menu = await screen.findByRole('menu')

    fireEvent.keyDown(menu, { key: 'ArrowUp' }) // wraps to last
    expect(screen.getByRole('menuitem', { name: /Download/ })).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'Home' })
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus()
  })

  it('runs the action and closes with focus back on the trigger', async () => {
    const user = userEvent.setup()
    render(<FloatingActionButton label="Share" actions={actions} />)
    const trigger = screen.getByRole('button', { name: 'Share' })
    await user.click(trigger)

    await user.click(await screen.findByRole('menuitem', { name: /Copy link/ }))

    expect(actions[0]!.onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<FloatingActionButton label="Share" actions={actions} />)
    const trigger = screen.getByRole('button', { name: 'Share' })
    await user.click(trigger)

    fireEvent.keyDown(await screen.findByRole('menu'), { key: 'Escape' })

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('labels the menu orientation from the direction', async () => {
    const user = userEvent.setup()
    render(<FloatingActionButton label="Share" actions={actions} direction="left" />)
    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(await screen.findByRole('menu')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('supports the controlled open state', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<FloatingActionButton label="Share" actions={actions} open={false} onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
