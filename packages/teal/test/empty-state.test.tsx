import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { EmptyState } from '../src/EmptyState'

describe('EmptyState', () => {
  it('renders the title as a heading with description and action', () => {
    render(
      <EmptyState title="No reports" description="Create your first report." action={<Button>Create report</Button>} />,
    )

    expect(screen.getByRole('heading', { name: 'No reports' })).toBeInTheDocument()
    expect(screen.getByText('Create your first report.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create report' })).toBeInTheDocument()
  })

  it('hides the icon well from assistive technology', () => {
    const { container } = render(<EmptyState title="Empty" />)

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})

describe('EmptyState status', () => {
  it('tints the default icon per status', () => {
    const { container, rerender } = render(<EmptyState status="success" title="Done" />)
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).toHaveClass('teal-u-text-tertiary')

    rerender(<EmptyState status="error" title="Failed" />)
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).toHaveClass('teal-u-text-error')

    rerender(<EmptyState status="warning" title="Careful" />)
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).toHaveClass('teal-u-text-warning')

    rerender(<EmptyState status="info" title="FYI" />)
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).toHaveClass('teal-u-text-primary')
  })

  it('renders distinct icons for the HTTP statuses', () => {
    const { container, rerender } = render(<EmptyState status="404" title="Not found" />)
    const classes = new Set<string>()
    classes.add(container.querySelector('svg')?.getAttribute('class') ?? '')
    rerender(<EmptyState status="403" title="Forbidden" />)
    classes.add(container.querySelector('svg')?.getAttribute('class') ?? '')
    rerender(<EmptyState status="500" title="Server error" />)
    classes.add(container.querySelector('svg')?.getAttribute('class') ?? '')

    expect(classes.size).toBe(3)
  })

  it('accepts a custom icon override and wires up the action', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <EmptyState
        status="error"
        title="Failed"
        icon={<svg data-testid="custom-icon" />}
        action={<Button onClick={onRetry}>Try again</Button>}
      />,
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
