import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Lightbulb } from 'lucide-react'
import { Alert } from '../src/Alert'
import { Button } from '../src/Button'

describe('Alert banner appearance', () => {
  it('renders title and children inside a status region', () => {
    render(
      <Alert appearance="banner" title="Maintenance" variant="info">
        Sunday 02:00–03:00 UTC
      </Alert>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Maintenance')
    expect(screen.getByRole('status')).toHaveTextContent('Sunday 02:00–03:00 UTC')
  })

  it('uses role="alert" for the danger variant', () => {
    render(<Alert appearance="banner" variant="danger" title="Outage" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders the action content and dismisses via the dismiss button', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert appearance="banner" title="Trial" action={<Button size="sm">Upgrade</Button>} onDismiss={onDismiss} />,
    )

    expect(screen.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

describe('Alert callout appearance', () => {
  it('does not assert itself as an alert or status, even for danger', () => {
    render(
      <Alert appearance="callout" variant="danger" title="Careful">
        Body
      </Alert>,
    )

    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('shows the left accent bar by default per variant', () => {
    const { container, rerender } = render(<Alert appearance="callout" title="Note" variant="info" />)
    expect(container.firstChild).toHaveClass('teal-u-border-l-4', 'teal-u-border-l-primary')

    rerender(<Alert appearance="callout" title="Note" variant="success" />)
    expect(container.firstChild).toHaveClass('teal-u-border-l-tertiary')

    rerender(<Alert appearance="callout" title="Note" variant="warning" />)
    expect(container.firstChild).toHaveClass('teal-u-border-l-warning')

    rerender(<Alert appearance="callout" title="Note" variant="danger" />)
    expect(container.firstChild).toHaveClass('teal-u-border-l-error')
  })

  it('hides the left accent bar when accent is false', () => {
    const { container } = render(<Alert appearance="callout" accent={false} title="Note" variant="info" />)

    expect(container.firstChild).not.toHaveClass('teal-u-border-l-4')
    expect(container.firstChild).not.toHaveClass('teal-u-border-l-primary')
  })

  it('renders the variant icon hidden from assistive technology and accepts a custom icon', () => {
    const { container, rerender } = render(<Alert appearance="callout" title="Note" />)
    const iconWrap = container.querySelector('span[aria-hidden="true"]')
    expect(iconWrap?.querySelector('svg')).toBeInTheDocument()

    rerender(<Alert appearance="callout" title="Note" icon={<Lightbulb data-testid="custom-icon" />} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})
