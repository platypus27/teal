import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Banner } from '../src/Banner'
import { Button } from '../src/Button'

describe('Banner', () => {
  it('renders title and children inside a status region', () => {
    render(<Banner title="Scheduled maintenance">The workspace will be read-only on Sunday.</Banner>)

    const banner = screen.getByRole('status')
    expect(banner).toHaveTextContent('Scheduled maintenance')
    expect(banner).toHaveTextContent('The workspace will be read-only on Sunday.')
  })

  it('uses role="alert" for the danger variant', () => {
    render(<Banner variant="danger" title="Outage">All saves are paused.</Banner>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders the action content', () => {
    render(
      <Banner title="Trial ending" action={<Button size="sm">Upgrade</Button>}>
        Seven days left on the trial.
      </Banner>,
    )
    expect(screen.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument()
  })

  it('calls onDismiss from the dismiss button', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Banner title="Update available" onDismiss={onDismiss}>
        A new version is ready.
      </Banner>,
    )

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('omits the dismiss button without onDismiss', () => {
    render(<Banner>Persistent notice</Banner>)
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()
  })
})
