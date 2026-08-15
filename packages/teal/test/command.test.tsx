import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Command, type CommandGroup, type CommandRenderState } from '../src/Command'

function makeGroups(): CommandGroup[] {
  return [
    {
      label: 'Project',
      items: [
        { id: 'new', label: 'New project', hint: '⌘N', onSelect: vi.fn() },
        { id: 'rename', label: 'Rename project', onSelect: vi.fn() },
      ],
    },
    {
      label: 'Workspace',
      items: [{ id: 'invite', label: 'Invite member', hint: '⌘I', onSelect: vi.fn() }],
    },
  ]
}

describe('Command', () => {
  it('renders all groups and items when open', () => {
    render(<Command open onOpenChange={vi.fn()} groups={makeGroups()} />)

    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: /New project/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('filters items case-insensitively across groups', async () => {
    const user = userEvent.setup()
    render(<Command open onOpenChange={vi.fn()} groups={makeGroups()} />)
    const input = screen.getByRole('combobox', { name: 'Search commands' })

    await user.type(input, 'INV')

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Invite member')
    expect(screen.queryByText('Project')).not.toBeInTheDocument()
  })

  it('moves the highlight with arrow keys and selects with Enter', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const groups = makeGroups()
    render(<Command open onOpenChange={onOpenChange} groups={groups} />)
    const input = screen.getByRole('combobox', { name: 'Search commands' })

    await user.click(input)
    await user.keyboard('{ArrowDown}{Enter}')

    expect(groups[0]?.items[1]?.onSelect).toHaveBeenCalledTimes(1)
    expect(groups[0]?.items[0]?.onSelect).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('selects an item by clicking and closes', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const groups = makeGroups()
    render(<Command open onOpenChange={onOpenChange} groups={groups} />)

    await user.click(screen.getByRole('option', { name: /Invite member/ }))

    expect(groups[1]?.items[0]?.onSelect).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Command open onOpenChange={vi.fn()} groups={makeGroups()} emptyMessage="Nothing found" />)
    const input = screen.getByRole('combobox', { name: 'Search commands' })

    await user.type(input, 'zzz')

    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(await screen.findByText('Nothing found')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Command open onOpenChange={onOpenChange} groups={makeGroups()} />)

    await user.click(screen.getByRole('combobox', { name: 'Search commands' }))
    await user.keyboard('{Escape}')

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

describe('Command render-prop mode', () => {
  function renderResults(state: CommandRenderState) {
    const results = ['alpha', 'beta', 'gamma'].filter((r) => r.includes(state.query))
    return (
      <ul id={state.listId} role="listbox">
        {results.map((result, index) => (
          <li
            key={result}
            id={state.optionId(index)}
            role="option"
            aria-selected={index === state.activeIndex}
            onMouseEnter={() => state.setActiveIndex(index)}
          >
            {result}
          </li>
        ))}
      </ul>
    )
  }

  it('opens full-screen with a focused combobox input', () => {
    render(
      <Command open onOpenChange={() => undefined} label="Site search" resultCount={3}>
        {renderResults}
      </Command>,
    )

    expect(screen.getByRole('dialog', { name: 'Site search' })).toBeInTheDocument()
    const input = screen.getByRole('combobox')
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'))
  })

  it('passes the query to the render prop and reports changes', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(
      <Command open onOpenChange={() => undefined} resultCount={3} onQueryChange={onQueryChange}>
        {renderResults}
      </Command>,
    )

    await user.type(screen.getByRole('combobox'), 'ga')

    expect(onQueryChange).toHaveBeenLastCalledWith('ga')
    expect(screen.getByRole('option', { name: 'gamma' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'alpha' })).toBeNull()
  })

  it('cycles the highlight with arrow keys and selects with Enter', () => {
    const onSelect = vi.fn()
    render(
      <Command open onOpenChange={() => undefined} resultCount={3} onSelect={onSelect}>
        {renderResults}
      </Command>,
    )
    const input = screen.getByRole('combobox')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' }) // wraps to 0
    fireEvent.keyDown(input, { key: 'ArrowUp' }) // back to 2
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('does not select when there are no results and closes via the close button', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onSelect = vi.fn()
    render(
      <Command open onOpenChange={onOpenChange} resultCount={0} onSelect={onSelect}>
        {renderResults}
      </Command>,
    )

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
    expect(onSelect).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
