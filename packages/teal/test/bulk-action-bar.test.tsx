import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BulkActionBar } from '../src/BulkActionBar'

describe('BulkActionBar', () => {
  it('renders nothing when count is 0', () => {
    const { container } = render(<BulkActionBar count={0} />)

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('announces the selection count in a live region', () => {
    render(<BulkActionBar count={3} />)

    const region = screen.getByRole('region', { name: 'Bulk actions' })
    expect(region).toBeInTheDocument()
    expect(screen.getByText('3 selected')).toHaveAttribute('aria-live', 'polite')
  })

  it('renders the child action buttons', () => {
    render(
      <BulkActionBar count={2}>
        <button>Delete</button>
      </BulkActionBar>,
    )

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onClear from the clear button', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<BulkActionBar count={5} onClear={onClear} />)

    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('omits the clear button when onClear is not provided', () => {
    render(<BulkActionBar count={1} />)

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
  })
})
