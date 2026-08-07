import { act, render, screen } from '@testing-library/react'
import { CountdownTimer } from '../src/CountdownTimer'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the remaining time as HH:MM:SS by default', () => {
    render(<CountdownTimer targetDate={new Date('2026-01-01T01:02:03Z')} />)

    expect(screen.getByText('01:02:03')).toBeInTheDocument()
  })

  it('prefixes whole days when more than a day remains', () => {
    render(<CountdownTimer targetDate={new Date('2026-01-03T01:00:00Z')} />)

    expect(screen.getByText('2d 01:00:00')).toBeInTheDocument()
  })

  it('ticks down on the interval', () => {
    render(<CountdownTimer targetDate={Date.now() + 10_000} />)

    expect(screen.getByText('00:00:10')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByText('00:00:07')).toBeInTheDocument()
  })

  it('keeps the ticking display out of the live region until completion', () => {
    render(<CountdownTimer targetDate={Date.now() + 10_000} />)

    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('calls onComplete once and announces completion politely', () => {
    const onComplete = vi.fn()
    render(<CountdownTimer targetDate={Date.now() + 2000} onComplete={onComplete} />)

    act(() => vi.advanceTimersByTime(5000))

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Countdown complete')

    act(() => vi.advanceTimersByTime(5000))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('fires onComplete immediately when the target is already in the past', () => {
    const onComplete = vi.fn()
    render(<CountdownTimer targetDate={Date.now() - 1000} onComplete={onComplete} />)

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Countdown complete')
  })

  it('supports a custom completion message', () => {
    render(<CountdownTimer targetDate={Date.now() - 1000} completionMessage="Launch window open" />)

    expect(screen.getByRole('status')).toHaveTextContent('Launch window open')
  })

  it('supports a render prop receiving the time parts', () => {
    render(
      <CountdownTimer targetDate={new Date('2026-01-02T01:02:03Z')}>
        {(parts) => `${parts.days}d ${parts.hours}h ${parts.minutes}m ${parts.seconds}s`}
      </CountdownTimer>,
    )

    expect(screen.getByText('1d 1h 2m 3s')).toBeInTheDocument()
  })
})
