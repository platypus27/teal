import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { Result } from '../src/Result'

describe('Result', () => {
  it('renders the title and description', () => {
    render(<Result status="success" title="Payment received" description="A receipt was sent to your inbox." />)

    expect(screen.getByText('Payment received')).toBeInTheDocument()
    expect(screen.getByText('A receipt was sent to your inbox.')).toBeInTheDocument()
  })

  it('tints the default icon per status', () => {
    const { container, rerender } = render(<Result status="success" title="Done" />)
    expect(container.querySelector('svg')?.parentElement).toHaveClass('teal-u-text-tertiary')

    rerender(<Result status="error" title="Failed" />)
    expect(container.querySelector('svg')?.parentElement).toHaveClass('teal-u-text-error')

    rerender(<Result status="warning" title="Careful" />)
    expect(container.querySelector('svg')?.parentElement).toHaveClass('teal-u-text-warning')

    rerender(<Result status="info" title="FYI" />)
    expect(container.querySelector('svg')?.parentElement).toHaveClass('teal-u-text-primary')
  })

  it('renders distinct icons for the HTTP statuses', () => {
    const { container, rerender } = render(<Result status="404" title="Not found" />)
    const notFoundIcon = container.querySelector('svg')?.getAttribute('class')

    rerender(<Result status="403" title="Forbidden" />)
    const forbiddenIcon = container.querySelector('svg')?.getAttribute('class')

    rerender(<Result status="500" title="Server error" />)
    const serverIcon = container.querySelector('svg')?.getAttribute('class')

    expect(new Set([notFoundIcon, forbiddenIcon, serverIcon]).size).toBe(3)
  })

  it('accepts a custom icon override', () => {
    render(<Result status="success" title="Done" icon={<svg data-testid="custom-icon" />} />)

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders the actions slot and wires up interactions', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <Result
        status="500"
        title="Something went wrong"
        actions={<Button onClick={onRetry}>Try again</Button>}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('hides the icon from assistive technology', () => {
    const { container } = render(<Result status="info" title="FYI" />)

    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
