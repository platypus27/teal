import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreeView, type TreeViewItem } from '../src/TreeView'

const items: TreeViewItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'input', label: 'Input.tsx' },
        ],
      },
      { id: 'app', label: 'App.tsx' },
    ],
  },
  { id: 'readme', label: 'README.md' },
]

function treeitem(name: string) {
  const element = screen.getByText(name).closest('[role="treeitem"]')
  if (!element) throw new Error(`No treeitem containing "${name}"`)
  return element
}

function row(name: string) {
  return screen.getByRole('button', { name })
}

describe('TreeView', () => {
  it('renders only root items when everything is collapsed', () => {
    render(<TreeView aria-label="Project files" items={items} />)
    expect(screen.getByRole('tree', { name: 'Project files' })).toBeInTheDocument()
    expect(treeitem('src')).toHaveAttribute('aria-expanded', 'false')
    expect(row('README.md')).toBeInTheDocument()
    expect(screen.queryByText('components')).not.toBeInTheDocument()
  })

  it('expands and collapses a parent by clicking', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<TreeView aria-label="Project files" items={items} onExpandedChange={onExpandedChange} />)

    await user.click(row('src'))
    expect(onExpandedChange).toHaveBeenLastCalledWith(['src'])
    expect(treeitem('src')).toHaveAttribute('aria-expanded', 'true')
    expect(row('components')).toBeInTheDocument()

    await user.click(row('src'))
    expect(onExpandedChange).toHaveBeenLastCalledWith([])
    expect(screen.queryByText('components')).not.toBeInTheDocument()
  })

  it('supports controlled expansion', () => {
    render(<TreeView aria-label="Project files" items={items} expandedIds={['src', 'components']} />)
    expect(row('Button.tsx')).toBeInTheDocument()
    expect(screen.getAllByRole('group')).toHaveLength(2)
  })

  it('expands with ArrowRight and collapses with ArrowLeft', async () => {
    const user = userEvent.setup()
    render(<TreeView aria-label="Project files" items={items} />)

    row('src').focus()
    await user.keyboard('{ArrowRight}')
    expect(treeitem('src')).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(treeitem('src')).toHaveAttribute('aria-expanded', 'false')
  })

  it('moves focus into the first child with ArrowRight on an expanded parent', async () => {
    const user = userEvent.setup()
    render(<TreeView aria-label="Project files" items={items} defaultExpandedIds={['src']} />)

    row('src').focus()
    await user.keyboard('{ArrowRight}')
    expect(row('components')).toHaveFocus()
  })

  it('moves focus through visible items with ArrowDown and ArrowUp', async () => {
    const user = userEvent.setup()
    render(<TreeView aria-label="Project files" items={items} defaultExpandedIds={['src']} />)

    row('src').focus()
    await user.keyboard('{ArrowDown}')
    expect(row('components')).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(row('App.tsx')).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(row('components')).toHaveFocus()
  })

  it('moves focus to the parent with ArrowLeft on a leaf', async () => {
    const user = userEvent.setup()
    render(<TreeView aria-label="Project files" items={items} defaultExpandedIds={['src']} />)

    row('App.tsx').focus()
    await user.keyboard('{ArrowLeft}')
    expect(row('src')).toHaveFocus()
  })

  it('selects an item with Enter and reports the selection', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TreeView aria-label="Project files" items={items} defaultExpandedIds={['src']} selectedId="app" onSelect={onSelect} />)

    expect(treeitem('App.tsx')).toHaveAttribute('aria-selected', 'true')

    row('README.md').focus()
    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith('readme')
  })
})
