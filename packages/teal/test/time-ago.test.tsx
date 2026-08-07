import { act, render, screen } from '@testing-library/react'
import { TimeAgo } from '../src/TimeAgo'

describe('TimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a relative label for a past date', () => {
    render(<TimeAgo date={new Date('2026-06-15T11:55:00Z')} />)

    expect(screen.getByText('5 minutes ago')).toBeInTheDocument()
  })

  it('renders future dates with an in-prefix', () => {
    render(<TimeAgo date={new Date('2026-06-15T13:00:00Z')} />)

    expect(screen.getByText('in 1 hour')).toBeInTheDocument()
  })

  it('updates the label on the interval', () => {
    render(<TimeAgo date={new Date('2026-06-15T11:55:00Z')} updateInterval={60000} />)

    act(() => vi.advanceTimersByTime(60000))
    expect(screen.getByText('6 minutes ago')).toBeInTheDocument()
  })

  it('exposes the absolute time in the title and dateTime attributes', () => {
    render(<TimeAgo date={new Date('2026-06-15T11:55:00Z')} />)

    const time = screen.getByText('5 minutes ago')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('dateTime', '2026-06-15T11:55:00.000Z')
    expect(time).toHaveAttribute('title', new Date('2026-06-15T11:55:00Z').toLocaleString('en'))
  })

  it('picks larger units for distant dates', () => {
    render(<TimeAgo date={new Date('2026-06-01T12:00:00Z')} />)

    expect(screen.getByText('2 weeks ago')).toBeInTheDocument()
  })

  it('supports other locales', () => {
    render(<TimeAgo date={new Date('2026-06-15T11:55:00Z')} locale="de" />)

    expect(screen.getByText('vor 5 Minuten')).toBeInTheDocument()
  })
})
