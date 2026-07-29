import { render, screen, waitFor } from '@testing-library/react'
import { Announcer } from '../src/Announcer'

describe('Announcer', () => {
  it('announces the message in a visually hidden polite status region', async () => {
    render(<Announcer message="Profile saved" />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveAttribute('aria-atomic', 'true')
    expect(status).toHaveStyle({ position: 'absolute', width: '1px', height: '1px' })
    await waitFor(() => expect(status).toHaveTextContent('Profile saved'))
  })

  it('supports assertive politeness', () => {
    render(<Announcer message="Session expired" politeness="assertive" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive')
  })

  it('re-announces when the message changes', async () => {
    const { rerender } = render(<Announcer message="First" />)
    const status = screen.getByRole('status')
    await waitFor(() => expect(status).toHaveTextContent('First'))

    rerender(<Announcer message="Second" />)
    await waitFor(() => expect(status).toHaveTextContent('Second'))
  })

  it('clears the region when the message is emptied', async () => {
    const { rerender } = render(<Announcer message="First" />)
    const status = screen.getByRole('status')
    await waitFor(() => expect(status).toHaveTextContent('First'))

    rerender(<Announcer message="" />)
    await waitFor(() => expect(status).toHaveTextContent(''))
  })
})
