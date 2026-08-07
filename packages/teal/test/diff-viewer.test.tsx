import { render, screen } from '@testing-library/react'
import { DiffViewer } from '../src/DiffViewer'

const oldValue = ['line one', 'line two', 'line three'].join('\n')
const newValue = ['line one', 'line 2', 'line three', 'line four'].join('\n')

describe('DiffViewer', () => {
  it('renders a labelled group', () => {
    render(<DiffViewer label="Config changes" oldValue={oldValue} newValue={newValue} />)

    expect(screen.getByRole('group', { name: 'Config changes' })).toBeInTheDocument()
  })

  it('computes added, removed, and context lines from old/new strings', () => {
    const { container } = render(<DiffViewer oldValue={oldValue} newValue={newValue} />)

    expect(screen.getByText('line two').closest('div')).toHaveClass('teal-u-bg-error/10')
    expect(screen.getByText('line 2').closest('div')).toHaveClass('teal-u-bg-primary/10')
    expect(screen.getByText('line four').closest('div')).toHaveClass('teal-u-bg-primary/10')
    expect(screen.getByText('line one').closest('div')).not.toHaveClass('teal-u-bg-primary/10')
    expect(screen.getByText('line one').closest('div')).not.toHaveClass('teal-u-bg-error/10')
    expect(container.querySelectorAll('.teal-u-bg-primary\\/10')).toHaveLength(2)
    expect(container.querySelectorAll('.teal-u-bg-error\\/10')).toHaveLength(1)
  })

  it('announces line types to screen readers', () => {
    render(<DiffViewer oldValue={oldValue} newValue={newValue} />)

    expect(screen.getAllByText('Added:')).toHaveLength(2)
    expect(screen.getAllByText('Removed:')).toHaveLength(1)
    expect(screen.getAllByText('Unchanged:')).toHaveLength(2)
  })

  it('renders pre-computed hunks and ignores old/new strings', () => {
    render(
      <DiffViewer
        oldValue="ignored"
        newValue="ignored"
        hunks={[
          { type: 'remove', content: 'gone' },
          { type: 'add', content: 'here' },
        ]}
      />,
    )

    expect(screen.getByText('gone')).toBeInTheDocument()
    expect(screen.getByText('here')).toBeInTheDocument()
    expect(screen.queryByText('ignored')).not.toBeInTheDocument()
  })

  it('shows old and new line numbers per row', () => {
    render(<DiffViewer oldValue={oldValue} newValue={newValue} />)

    // Context line 1 shows "1" in both gutters; the removal shows old line 2 only.
    const removedRow = screen.getByText('line two').closest('div')
    expect(removedRow?.querySelectorAll('span')[0]).toHaveTextContent('2')
    expect(removedRow?.querySelectorAll('span')[1]).toBeEmptyDOMElement()
  })

  it('hides the line-number gutters when lineNumbers is false', () => {
    render(<DiffViewer oldValue={oldValue} newValue={newValue} lineNumbers={false} />)

    const row = screen.getByText('line one').closest('div')
    expect(row?.querySelectorAll('span')).toHaveLength(2) // sign + sr-only label only
  })
})
