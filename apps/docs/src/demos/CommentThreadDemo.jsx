import { CommentThread } from '@kryv/teal'

const comments = [
  {
    id: '1',
    author: 'Ada Lovelace',
    body: 'The parser rewrite looks good overall. Nice cleanup of the token stream.',
    timestamp: new Date(Date.now() - 3 * 3_600_000),
    replies: [
      {
        id: '1a',
        author: 'Alan Turing',
        body: 'Agreed, but the lexer still needs property-based tests.',
        timestamp: new Date(Date.now() - 2 * 3_600_000),
      },
      {
        id: '1b',
        author: 'Grace Hopper',
        body: 'I can pick up the lexer tests this afternoon.',
        timestamp: new Date(Date.now() - 1 * 3_600_000),
      },
    ],
  },
  {
    id: '2',
    author: 'Edsger Dijkstra',
    body: 'Please keep the public API unchanged for this release.',
    timestamp: new Date(Date.now() - 5 * 3_600_000),
  },
]

export function CommentThreadDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <CommentThread
        label="Design review comments"
        comments={comments.slice(0, 1)}
        onReply={(comment) => window.alert(`Reply to ${comment.author}`)}
        className="w-full max-w-lg"
      />
    )
  }

  return <CommentThread label="Pull request comments" comments={comments} className="w-full max-w-lg" />
}
