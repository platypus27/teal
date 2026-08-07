import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreeGrid, type TreeGridColumn, type TreeGridRow } from '../src/TreeGrid'

const columns: TreeGridColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
]

const rows: TreeGridRow[] = [
  {
    id: 'src',
    name: 'src',
    size: '—',
    children: [
      { id: 'app', name: 'app.ts', size: '2 KB' },
      { id: 'index', name: 'index.ts', size: '1 KB' },
    ],
  },
  { id: 'pkg', name: 'package.json', size: '3 KB' },
]

function getRow(name: string) {
  return screen.getByRole('row', { name: new RegExp(name) })
}

describe('TreeGrid', () => {
  it('renders a treegrid with column headers and top-level rows', () => {
    render(<TreeGrid aria-label="Project files" columns={columns} rows={rows} />)

    expect(screen.getByRole('treegrid', { name: 'Project files' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Size' })).toBeInTheDocument()

    const src = getRow('src')
    expect(src).toHaveAttribute('aria-expanded', 'false')
    expect(src).toHaveAttribute('aria-level', '1')
    expect(getRow('package.json')).not.toHaveAttribute('aria-expanded')
    // Children of a collapsed row are not rendered.
    expect(screen.queryByRole('row', { name: /app\.ts/ })).not.toBeInTheDocument()
  })

  it('expands a row with ArrowRight and collapses it with ArrowLeft', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<TreeGrid aria-label="Project files" columns={columns} rows={rows} onExpandedChange={onExpandedChange} />)

    await user.click(screen.getByText('src'))
    fireEvent.keyDown(getRow('src'), { key: 'ArrowRight' })

    expect(onExpandedChange).toHaveBeenCalledWith(['src'])
    expect(getRow('src')).toHaveAttribute('aria-expanded', 'true')
    expect(getRow('app.ts')).toHaveAttribute('aria-level', '2')

    fireEvent.keyDown(getRow('src'), { key: 'ArrowLeft' })
    expect(onExpandedChange).toHaveBeenCalledWith([])
    expect(getRow('src')).toHaveAttribute('aria-expanded', 'false')
  })

  it('moves focus between visible rows and from a child to its parent', async () => {
    const user = userEvent.setup()
    render(<TreeGrid aria-label="Project files" columns={columns} rows={rows} defaultExpandedIds={['src']} />)

    await user.click(screen.getByText('src'))
    fireEvent.keyDown(getRow('src'), { key: 'ArrowDown' })
    expect(getRow('app.ts')).toHaveFocus()

    fireEvent.keyDown(getRow('app.ts'), { key: 'ArrowDown' })
    expect(getRow('index.ts')).toHaveFocus()

    fireEvent.keyDown(getRow('index.ts'), { key: 'ArrowUp' })
    expect(getRow('app.ts')).toHaveFocus()

    fireEvent.keyDown(getRow('app.ts'), { key: 'ArrowLeft' })
    expect(getRow('src')).toHaveFocus()

    fireEvent.keyDown(getRow('src'), { key: 'End' })
    expect(getRow('package.json')).toHaveFocus()

    fireEvent.keyDown(getRow('package.json'), { key: 'Home' })
    expect(getRow('src')).toHaveFocus()
  })

  it('toggles expansion from the chevron button', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<TreeGrid aria-label="Project files" columns={columns} rows={rows} onExpandedChange={onExpandedChange} />)

    await user.click(screen.getByRole('button', { name: 'Expand src' }))
    expect(onExpandedChange).toHaveBeenCalledWith(['src'])
    expect(getRow('src')).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'Collapse src' }))
    expect(onExpandedChange).toHaveBeenCalledWith([])
    expect(getRow('src')).toHaveAttribute('aria-expanded', 'false')
  })

  it('respects controlled expandedIds', () => {
    const onExpandedChange = vi.fn()
    render(<TreeGrid aria-label="Project files" columns={columns} rows={rows} expandedIds={['src']} onExpandedChange={onExpandedChange} />)

    expect(getRow('src')).toHaveAttribute('aria-expanded', 'true')
    expect(getRow('app.ts')).toBeInTheDocument()

    fireEvent.keyDown(getRow('src'), { key: 'ArrowLeft' })
    expect(onExpandedChange).toHaveBeenCalledWith([])
    // Controlled: the rendered rows are unchanged.
    expect(getRow('src')).toHaveAttribute('aria-expanded', 'true')
  })
})
