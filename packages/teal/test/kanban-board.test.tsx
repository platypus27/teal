import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KanbanBoard, type KanbanColumn } from '../src/KanbanBoard'

const columns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To do',
    cards: [
      { id: 'a', title: 'Design tokens' },
      { id: 'b', title: 'Empty states', description: 'For every list' },
    ],
  },
  { id: 'doing', title: 'Doing', cards: [{ id: 'c', title: 'Kanban tests' }] },
  { id: 'done', title: 'Done', cards: [] },
]

function getCard(title: string) {
  return screen.getByRole('button', { name: new RegExp(title) })
}

describe('KanbanBoard', () => {
  it('renders a labelled region with a section per column and a button per card', () => {
    render(<KanbanBoard label="Sprint board" defaultColumns={columns} />)

    expect(screen.getByRole('region', { name: 'Sprint board' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /To do/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Done/ })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('moves focus between cards and columns with arrow keys', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard defaultColumns={columns} />)

    await user.click(getCard('Design tokens'))
    fireEvent.keyDown(getCard('Design tokens'), { key: 'ArrowDown' })
    expect(getCard('Empty states')).toHaveFocus()

    fireEvent.keyDown(getCard('Empty states'), { key: 'ArrowRight' })
    expect(getCard('Kanban tests')).toHaveFocus()

    // The last column has no cards, so focus stays put.
    fireEvent.keyDown(getCard('Kanban tests'), { key: 'ArrowRight' })
    expect(getCard('Kanban tests')).toHaveFocus()
  })

  it('grabs a card with Enter and moves it across columns with arrows', async () => {
    const user = userEvent.setup()
    const onColumnsChange = vi.fn()
    render(<KanbanBoard defaultColumns={columns} onColumnsChange={onColumnsChange} />)

    await user.click(getCard('Empty states'))
    fireEvent.keyDown(getCard('Empty states'), { key: 'Enter' })
    expect(getCard('Empty states')).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(getCard('Empty states'), { key: 'ArrowRight' })
    expect(onColumnsChange).toHaveBeenCalledTimes(1)
    const next = onColumnsChange.mock.calls[0]?.[0] as KanbanColumn[]
    expect(next[1]?.cards.map((card) => card.id)).toEqual(['c', 'b'])
    expect(next[0]?.cards.map((card) => card.id)).toEqual(['a'])
    expect(getCard('Empty states')).toHaveFocus()

    fireEvent.keyDown(getCard('Empty states'), { key: 'Enter' })
    expect(getCard('Empty states')).toHaveAttribute('aria-pressed', 'false')
  })

  it('reorders a grabbed card within its column', async () => {
    const user = userEvent.setup()
    const onColumnsChange = vi.fn()
    render(<KanbanBoard defaultColumns={columns} onColumnsChange={onColumnsChange} />)

    await user.click(getCard('Empty states'))
    fireEvent.keyDown(getCard('Empty states'), { key: 'Enter' })
    fireEvent.keyDown(getCard('Empty states'), { key: 'ArrowUp' })

    const next = onColumnsChange.mock.calls[0]?.[0] as KanbanColumn[]
    expect(next[0]?.cards.map((card) => card.id)).toEqual(['b', 'a'])
  })

  it('cancels a grab with Escape without moving the card', async () => {
    const user = userEvent.setup()
    const onColumnsChange = vi.fn()
    render(<KanbanBoard defaultColumns={columns} onColumnsChange={onColumnsChange} />)

    await user.click(getCard('Design tokens'))
    fireEvent.keyDown(getCard('Design tokens'), { key: 'Enter' })
    expect(getCard('Design tokens')).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(getCard('Design tokens'), { key: 'Escape' })
    expect(getCard('Design tokens')).toHaveAttribute('aria-pressed', 'false')
    expect(onColumnsChange).not.toHaveBeenCalled()
  })

  it('keeps a single tab stop that follows the active card', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard defaultColumns={columns} />)

    expect(getCard('Design tokens')).toHaveAttribute('tabIndex', '0')
    expect(getCard('Empty states')).toHaveAttribute('tabIndex', '-1')

    await user.click(getCard('Empty states'))
    expect(getCard('Empty states')).toHaveAttribute('tabIndex', '0')
    expect(getCard('Design tokens')).toHaveAttribute('tabIndex', '-1')
  })

  it('reports moves without mutating controlled columns', async () => {
    const user = userEvent.setup()
    const onColumnsChange = vi.fn()
    render(<KanbanBoard columns={columns} onColumnsChange={onColumnsChange} />)

    await user.click(getCard('Kanban tests'))
    fireEvent.keyDown(getCard('Kanban tests'), { key: 'Enter' })
    fireEvent.keyDown(getCard('Kanban tests'), { key: 'ArrowRight' })

    expect(onColumnsChange).toHaveBeenCalledTimes(1)
    const next = onColumnsChange.mock.calls[0]?.[0] as KanbanColumn[]
    expect(next[2]?.cards.map((card) => card.id)).toEqual(['c'])
    // Controlled: the rendered board is unchanged.
    expect(within(screen.getByRole('region', { name: 'Kanban board' })).getAllByRole('button')).toHaveLength(3)
    expect(getCard('Kanban tests')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Done/ })).toBeInTheDocument()
  })
})
