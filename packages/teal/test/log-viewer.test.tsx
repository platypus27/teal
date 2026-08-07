import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogViewer, type LogLine } from '../src/LogViewer'

const lines: LogLine[] = [
  { id: '1', level: 'info', message: 'server started on port 3000', timestamp: '10:00:01' },
  { id: '2', level: 'warn', message: 'cache is 90% full', timestamp: '10:00:12' },
  { id: '3', level: 'error', message: 'failed to reach cache node', timestamp: '10:00:13' },
]

describe('LogViewer', () => {
  it('renders a labelled log with one row per line', () => {
    render(<LogViewer label="Deploy logs" lines={lines} />)

    expect(screen.getByRole('log', { name: 'Deploy logs' })).toBeInTheDocument()
    expect(screen.getByText('server started on port 3000')).toBeInTheDocument()
    expect(screen.getByText('failed to reach cache node')).toBeInTheDocument()
  })

  it('colors the level prefix per severity', () => {
    render(<LogViewer lines={lines} />)

    expect(screen.getByText('error')).toHaveClass('teal-u-text-error')
    expect(screen.getByText('warn')).toHaveClass('teal-u-text-warning')
    expect(screen.getByText('info')).toHaveClass('teal-u-text-primary')
  })

  it('defaults missing levels to info', () => {
    render(<LogViewer lines={[{ message: 'plain line' }]} />)

    expect(screen.getByText('info')).toBeInTheDocument()
  })

  it('shows the empty message when there are no lines', () => {
    render(<LogViewer lines={[]} emptyMessage="Quiet so far" />)

    expect(screen.getByText('Quiet so far')).toBeInTheDocument()
  })

  it('starts in follow mode and toggles to paused', async () => {
    const user = userEvent.setup()
    const onFollowChange = vi.fn()
    render(<LogViewer lines={lines} onFollowChange={onFollowChange} />)

    const toggle = screen.getByRole('button', { name: 'Pause follow' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await user.click(toggle)
    expect(onFollowChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('button', { name: 'Follow' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('supports controlled follow state', async () => {
    const user = userEvent.setup()
    const onFollowChange = vi.fn()
    render(<LogViewer lines={lines} follow={false} onFollowChange={onFollowChange} />)

    await user.click(screen.getByRole('button', { name: 'Follow' }))
    expect(onFollowChange).toHaveBeenCalledWith(true)
    // Still paused because the parent did not update the prop.
    expect(screen.getByRole('button', { name: 'Follow' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('highlights case-insensitive search matches', () => {
    render(<LogViewer lines={lines} search="CACHE" />)

    const marks = screen.getAllByText('cache', { selector: 'mark' })
    expect(marks).toHaveLength(2)
  })

  it('renders no marks without a search query', () => {
    const { container } = render(<LogViewer lines={lines} />)

    expect(container.querySelector('mark')).not.toBeInTheDocument()
  })
})
