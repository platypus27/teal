import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SplitButton } from '../src/SplitButton'
import type { MenuItem } from '../src/Menu'

function makeItems(): MenuItem[] {
  return [
    { id: 'duplicate', label: 'Duplicate', onSelect: vi.fn() },
    { id: 'archive', label: 'Archive', variant: 'danger', onSelect: vi.fn() },
  ]
}

describe('SplitButton', () => {
  it('calls onClick when the main action is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<SplitButton label="Deploy" onClick={onClick} items={makeItems()} />)

    await user.click(screen.getByRole('button', { name: 'Deploy' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('opens the menu from the trigger and fires item onSelect', async () => {
    const user = userEvent.setup()
    const items = makeItems()
    render(<SplitButton label="Deploy" onClick={vi.fn()} items={items} />)

    await user.click(screen.getByRole('button', { name: 'More actions' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Duplicate' }))

    expect(items[0]?.onSelect).toHaveBeenCalledTimes(1)
    expect(items[1]?.onSelect).not.toHaveBeenCalled()
  })

  it('disables both buttons', () => {
    render(<SplitButton label="Deploy" onClick={vi.fn()} items={makeItems()} disabled />)

    expect(screen.getByRole('button', { name: 'Deploy' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'More actions' })).toBeDisabled()
  })
})
