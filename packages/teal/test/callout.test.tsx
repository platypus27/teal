import { render, screen } from '@testing-library/react'
import { Lightbulb } from 'lucide-react'
import { Callout } from '../src/Callout'

describe('Callout', () => {
  it('renders the title and body', () => {
    render(<Callout title="Heads up">New pricing starts next month.</Callout>)

    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('New pricing starts next month.')).toBeInTheDocument()
  })

  it('does not assert itself as an alert or status by default', () => {
    render(<Callout variant="danger" title="Danger">Something needs care.</Callout>)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('applies the info variant styling by default', () => {
    render(<Callout data-testid="callout">Body</Callout>)

    expect(screen.getByTestId('callout')).toHaveClass('teal-u-border-l-primary')
  })

  it('applies the styling of each variant', () => {
    const { rerender } = render(<Callout data-testid="callout" variant="success">Body</Callout>)
    expect(screen.getByTestId('callout')).toHaveClass('teal-u-border-l-tertiary')

    rerender(<Callout data-testid="callout" variant="warning">Body</Callout>)
    expect(screen.getByTestId('callout')).toHaveClass('teal-u-border-l-warning')

    rerender(<Callout data-testid="callout" variant="danger">Body</Callout>)
    expect(screen.getByTestId('callout')).toHaveClass('teal-u-border-l-error')
  })

  it('renders the variant icon hidden from assistive technology', () => {
    const { container } = render(<Callout title="Heads up">Body</Callout>)

    const iconWrapper = container.querySelector('span[aria-hidden="true"]')
    expect(iconWrapper).not.toBeNull()
    expect(iconWrapper?.querySelector('svg')).not.toBeNull()
  })

  it('accepts a custom icon', () => {
    render(
      <Callout title="Tip" icon={<Lightbulb data-testid="custom-icon" />}>
        Body
      </Callout>,
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    render(
      <Callout data-testid="callout" className="custom-class">
        Body
      </Callout>,
    )

    expect(screen.getByTestId('callout')).toHaveClass('custom-class')
    expect(screen.getByTestId('callout')).toHaveClass('teal-u-border-l-4')
  })
})
