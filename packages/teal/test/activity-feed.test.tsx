import { fireEvent, render, screen } from '@testing-library/react'
import { ActivityFeed, type ActivityFeedItem } from '../src/ActivityFeed'

const now = new Date()
const yesterday = new Date(now)
yesterday.setDate(now.getDate() - 1)

const items: ActivityFeedItem[] = [
  { id: '1', actor: 'Ada Lovelace', action: 'merged the parser rewrite', timestamp: now },
  { id: '2', actor: 'Alan Turing', action: 'commented on the cipher spec', timestamp: yesterday },
]

const formatTime = () => 'just now'

describe('ActivityFeed', () => {
  it('renders a labelled feed with one article per item', () => {
    render(<ActivityFeed label="Project activity" items={items} formatTime={formatTime} />)

    expect(screen.getByRole('feed', { name: 'Project activity' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(
      screen.getByRole('article', { name: 'Ada Lovelace merged the parser rewrite, just now' }),
    ).toBeInTheDocument()
  })

  it('shows the empty message when there are no items', () => {
    render(<ActivityFeed items={[]} emptyMessage="Nothing happened" />)

    expect(screen.getByText('Nothing happened')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('groups items under Today and Yesterday headings when groupByDay', () => {
    render(<ActivityFeed items={items} groupByDay formatTime={formatTime} />)

    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Yesterday' })).toBeInTheDocument()
  })

  it('does not render day headings without groupByDay', () => {
    render(<ActivityFeed items={items} formatTime={formatTime} />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('moves focus between articles with PageDown and PageUp', () => {
    render(<ActivityFeed items={items} formatTime={formatTime} />)

    const articles = screen.getAllByRole('article')
    const first = articles[0]!
    const second = articles[1]!
    first.focus()
    fireEvent.keyDown(first, { key: 'PageDown' })
    expect(second).toHaveFocus()

    fireEvent.keyDown(second, { key: 'PageUp' })
    expect(first).toHaveFocus()
  })

  it('clamps PageDown at the last article', () => {
    render(<ActivityFeed items={items} formatTime={formatTime} />)

    const articles = screen.getAllByRole('article')
    const last = articles[1]!
    last.focus()
    fireEvent.keyDown(last, { key: 'PageDown' })
    expect(last).toHaveFocus()
  })

  it('renders a custom icon instead of the avatar when provided', () => {
    render(
      <ActivityFeed
        items={[{ id: '1', actor: 'Deploy bot', action: 'shipped v2', timestamp: now, icon: <svg data-testid="icon" /> }]}
        formatTime={formatTime}
      />,
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Deploy bot' })).not.toBeInTheDocument()
  })
})
