import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentThread, type CommentThreadComment } from '../src/CommentThread'

const comments: CommentThreadComment[] = [
  {
    id: '1',
    author: 'Ada Lovelace',
    body: 'The parser rewrite looks good overall.',
    timestamp: '2026-08-01T10:00:00Z',
    replies: [
      { id: '1a', author: 'Alan Turing', body: 'Agreed, but the lexer needs tests.', timestamp: '2026-08-01T11:00:00Z' },
      { id: '1b', author: 'Grace Hopper', body: 'I can add the lexer tests.', timestamp: '2026-08-01T12:00:00Z' },
    ],
  },
  { id: '2', author: 'Edsger Dijkstra', body: 'Please keep the public API unchanged.' },
]

const formatTime = () => '2h ago'

describe('CommentThread', () => {
  it('renders top-level and nested comments', () => {
    render(<CommentThread comments={comments} formatTime={formatTime} />)

    expect(screen.getByText('The parser rewrite looks good overall.')).toBeInTheDocument()
    expect(screen.getByText('Agreed, but the lexer needs tests.')).toBeInTheDocument()
    expect(screen.getByText('Please keep the public API unchanged.')).toBeInTheDocument()
  })

  it('calls onReply with the comment when its reply button is clicked', async () => {
    const user = userEvent.setup()
    const onReply = vi.fn()
    render(<CommentThread comments={comments} onReply={onReply} formatTime={formatTime} />)

    await user.click(screen.getByRole('button', { name: 'Reply to Alan Turing' }))

    expect(onReply).toHaveBeenCalledWith(comments[0]!.replies![0]!)
  })

  it('does not render reply buttons without onReply', () => {
    render(<CommentThread comments={comments} formatTime={formatTime} />)

    expect(screen.queryByRole('button', { name: /Reply to/ })).not.toBeInTheDocument()
  })

  it('collapses and expands a nested thread', async () => {
    const user = userEvent.setup()
    render(<CommentThread comments={comments} formatTime={formatTime} />)

    const toggle = screen.getByRole('button', { name: 'Collapse replies to Ada Lovelace' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(screen.queryByText('Agreed, but the lexer needs tests.')).not.toBeInTheDocument()

    const expand = screen.getByRole('button', { name: 'Show replies to Ada Lovelace' })
    expect(expand).toHaveAttribute('aria-expanded', 'false')

    await user.click(expand)
    expect(screen.getByText('Agreed, but the lexer needs tests.')).toBeInTheDocument()
  })

  it('shows the reply count while collapsed', async () => {
    const user = userEvent.setup()
    render(<CommentThread comments={comments} formatTime={formatTime} />)

    await user.click(screen.getByRole('button', { name: 'Collapse replies to Ada Lovelace' }))
    expect(screen.getByText('2 replies')).toBeInTheDocument()
  })

  it('does not render a collapse toggle for comments without replies', () => {
    render(<CommentThread comments={comments} formatTime={formatTime} />)

    expect(screen.queryByRole('button', { name: /replies to Edsger Dijkstra/ })).not.toBeInTheDocument()
  })
})
