import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { CookieConsent } from '../src/CookieConsent'

describe('CookieConsent', () => {
  it('renders a polite region with message, actions and manage link', () => {
    render(
      <CookieConsent
        message="We use cookies to improve your experience."
        manageHref="/settings/cookies"
      />,
    )

    const region = screen.getByRole('region', { name: 'Cookie consent' })
    expect(region).toBeInTheDocument()
    expect(screen.getByText('We use cookies to improve your experience.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Manage preferences' })).toHaveAttribute('href', '/settings/cookies')
  })

  it('dismisses on accept and reports the choice', async () => {
    const user = userEvent.setup()
    const onAccept = vi.fn()
    const onOpenChange = vi.fn()
    render(<CookieConsent message="Cookies?" onAccept={onAccept} onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Accept' }))
    expect(onAccept).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('dismisses on decline and reports the choice', async () => {
    const user = userEvent.setup()
    const onDecline = vi.fn()
    render(<CookieConsent message="Cookies?" onDecline={onDecline} />)

    await user.click(screen.getByRole('button', { name: 'Decline' }))
    expect(onDecline).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('supports custom action labels', () => {
    render(<CookieConsent message="Cookies?" acceptLabel="Allow all" declineLabel="Reject all" />)

    expect(screen.getByRole('button', { name: 'Allow all' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject all' })).toBeInTheDocument()
  })

  it('omits the manage link when no href is given', () => {
    render(<CookieConsent message="Cookies?" />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('supports controlled visibility', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setOpen(true)}>Review cookies</Button>
          <CookieConsent message="Cookies?" open={open} onOpenChange={setOpen} />
        </>
      )
    }
    render(<Controlled />)

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Review cookies' }))
    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Accept' }))
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })
})
