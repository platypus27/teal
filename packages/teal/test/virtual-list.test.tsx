import { fireEvent, render, screen } from '@testing-library/react'
import { VirtualList } from '../src/VirtualList'

const items = Array.from({ length: 100 }, (_, index) => `Item ${index}`)

function renderList(props: Partial<Parameters<typeof VirtualList<string>>[0]> = {}) {
  return render(
    <VirtualList
      items={items}
      itemHeight={20}
      height={100}
      label="Roster"
      renderItem={(item) => <span>{item}</span>}
      {...props}
    />,
  )
}

describe('VirtualList', () => {
  it('renders only the visible window plus overscan', () => {
    renderList()

    expect(screen.getByRole('list', { name: 'Roster' })).toBeInTheDocument()
    // 5 visible rows + 3 overscan rows below the viewport.
    expect(screen.getAllByRole('listitem')).toHaveLength(8)
    expect(screen.getByText('Item 0')).toBeInTheDocument()
    expect(screen.queryByText('Item 20')).not.toBeInTheDocument()
  })

  it('renders a later window after scrolling', () => {
    renderList()

    fireEvent.scroll(screen.getByRole('list', { name: 'Roster' }), { target: { scrollTop: 1000 } })

    expect(screen.queryByText('Item 0')).not.toBeInTheDocument()
    expect(screen.getByText('Item 50')).toBeInTheDocument()
  })

  it('positions rows absolutely inside a full-height spacer', () => {
    renderList()

    const firstRow = screen.getByText('Item 0').closest('[role="listitem"]') as HTMLElement
    expect(firstRow.style.top).toBe('0px')
    expect(firstRow.style.height).toBe('20px')
    expect(firstRow.parentElement?.style.height).toBe('2000px')
  })

  it('exposes set size and position for the virtualized rows', () => {
    renderList()

    fireEvent.scroll(screen.getByRole('list', { name: 'Roster' }), { target: { scrollTop: 1000 } })

    const row = screen.getByText('Item 50').closest('[role="listitem"]')
    expect(row).toHaveAttribute('aria-setsize', '100')
    expect(row).toHaveAttribute('aria-posinset', '51')
  })

  it('is focusable so keyboard scrolling stays usable', () => {
    renderList()

    expect(screen.getByRole('list', { name: 'Roster' })).toHaveAttribute('tabindex', '0')
  })

  it('respects the overscan prop', () => {
    renderList({ overscan: 0 })

    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })
})
