import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrgChart, type OrgChartNode } from '../src/OrgChart'

const root: OrgChartNode = {
  id: 'ceo',
  name: 'Ada',
  title: 'CEO',
  children: [
    {
      id: 'cto',
      name: 'Ben',
      title: 'CTO',
      children: [{ id: 'dev', name: 'Cleo', title: 'Engineer' }],
    },
    { id: 'cfo', name: 'Dana', title: 'CFO' },
  ],
}

describe('OrgChart', () => {
  it('renders the hierarchy with names, titles, and collapse controls for parents', () => {
    render(<OrgChart root={root} />)

    expect(screen.getByRole('group', { name: 'Organization chart' })).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
    expect(screen.getByText('CTO')).toBeInTheDocument()
    expect(screen.getByText('Cleo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Collapse Ada's reports" })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: "Collapse Ben's reports" })).toHaveAttribute('aria-expanded', 'true')
    // Dana has no reports, so no toggle is rendered for her.
    expect(screen.queryByRole('button', { name: /Dana/ })).not.toBeInTheDocument()
  })

  it('collapses a subtree from its toggle button', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<OrgChart root={root} onCollapsedChange={onCollapsedChange} />)

    await user.click(screen.getByRole('button', { name: "Collapse Ben's reports" }))

    expect(onCollapsedChange).toHaveBeenCalledWith(['cto'])
    expect(screen.queryByText('Cleo')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Expand Ben's reports" })).toHaveAttribute('aria-expanded', 'false')
    // Sibling and parent stay visible.
    expect(screen.getByText('Dana')).toBeInTheDocument()
  })

  it('starts collapsed from defaultCollapsedIds and expands on click', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<OrgChart root={root} defaultCollapsedIds={['ceo']} onCollapsedChange={onCollapsedChange} />)

    expect(screen.queryByText('Ben')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: "Expand Ada's reports" }))

    expect(onCollapsedChange).toHaveBeenCalledWith([])
    expect(screen.getByText('Ben')).toBeInTheDocument()
    expect(screen.getByText('Cleo')).toBeInTheDocument()
  })

  it('respects controlled collapsedIds', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<OrgChart root={root} collapsedIds={['ceo']} onCollapsedChange={onCollapsedChange} />)

    await user.click(screen.getByRole('button', { name: "Expand Ada's reports" }))

    expect(onCollapsedChange).toHaveBeenCalledWith([])
    // Controlled: the rendered tree is unchanged.
    expect(screen.queryByText('Ben')).not.toBeInTheDocument()
  })
})
