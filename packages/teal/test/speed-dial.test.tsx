import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SpeedDial, SpeedDialAction } from '../src/SpeedDial'

function renderDial(props = {}) {
  return render(
    <SpeedDial label="Quick actions" {...props}>
      <SpeedDialAction label="New file" />
      <SpeedDialAction label="New folder" />
      <SpeedDialAction label="Upload" />
    </SpeedDial>,
  )
}

describe('SpeedDial', () => {
  it('renders a collapsed trigger with menu semantics', () => {
    renderDial()

    const trigger = screen.getByRole('button', { name: 'Quick actions' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('expands on click and moves focus to the first action', async () => {
    const user = userEvent.setup()
    renderDial()

    await user.click(screen.getByRole('button', { name: 'Quick actions' }))

    const trigger = screen.getByRole('button', { name: 'Quick actions' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu', { name: 'Quick actions' })).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    renderDial({ defaultOpen: true })

    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quick actions' })).toHaveFocus()
  })

  it('moves between actions with arrow keys and wraps around', async () => {
    renderDial({ defaultOpen: true })

    const menu = screen.getByRole('menu')
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'New folder' })).toHaveFocus()

    fireEvent.keyDown(menu, { key: 'ArrowUp' })
    expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus()

    fireEvent.keyDown(menu, { key: 'ArrowUp' })
    expect(screen.getByRole('menuitem', { name: 'Upload' })).toHaveFocus()

    fireEvent.keyDown(menu, { key: 'End' })
    expect(screen.getByRole('menuitem', { name: 'Upload' })).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'Home' })
    expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus()
  })

  it('runs the action and closes with focus back on the trigger', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SpeedDial label="Quick actions" defaultOpen>
        <SpeedDialAction label="New file" onClick={onClick} />
      </SpeedDial>,
    )

    await user.click(screen.getByRole('menuitem', { name: 'New file' }))

    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quick actions' })).toHaveFocus()
  })

  it('supports the controlled open state', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SpeedDial label="Quick actions" open={false} onOpenChange={onOpenChange}>
        <SpeedDialAction label="New file" />
      </SpeedDial>,
    )

    await user.click(screen.getByRole('button', { name: 'Quick actions' }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('labels the menu orientation from the direction', () => {
    renderDial({ defaultOpen: true, direction: 'left' })

    expect(screen.getByRole('menu')).toHaveAttribute('aria-orientation', 'horizontal')
  })
})
