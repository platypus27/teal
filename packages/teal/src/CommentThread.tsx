import { forwardRef, useState, type HTMLAttributes } from 'react'
import { ChevronDown, ChevronRight, Reply } from 'lucide-react'
import { Avatar } from './Avatar'
import { cn } from './cn'

export interface CommentThreadComment {
  /** Name shown as the comment author. */
  author: string
  /** Optional image URL for the author avatar. */
  avatarSrc?: string
  /** Comment text. */
  body: string
  /** Unique id used as the React key. */
  id: string
  /** Nested replies to this comment. */
  replies?: CommentThreadComment[]
  /** When the comment was posted. */
  timestamp?: Date | string | number
}

export interface CommentThreadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Top-level comments; each may carry nested `replies`. */
  comments: CommentThreadComment[]
  /** Formats a comment timestamp. */
  formatTime?: (timestamp: Date | string | number) => string
  /** Accessible name for the thread. */
  label?: string
  /** When provided, each comment shows a reply button that calls this handler. */
  onReply?: (comment: CommentThreadComment) => void
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function defaultFormatTime(timestamp: Date | string | number): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  return timeFormatter.format(date)
}

interface CommentNodeProps {
  comment: CommentThreadComment
  depth: number
  formatTime: (timestamp: Date | string | number) => string
  onReply: ((comment: CommentThreadComment) => void) | undefined
}

function CommentNode({ comment, depth, formatTime, onReply }: CommentNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const replies = comment.replies ?? []
  const hasReplies = replies.length > 0

  return (
    <li className={cn(depth > 0 && 'teal-u-ml-4 teal-u-border-0 teal-u-border-l-2 teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-pl-4')}>
      <div className="teal-u-flex teal-u-items-start teal-u-gap-3">
        <Avatar size="sm" name={comment.author} {...(comment.avatarSrc !== undefined ? { src: comment.avatarSrc } : {})} />
        <div className="teal-u-min-w-0 teal-u-flex-1">
          <p className="teal-u-flex teal-u-flex-wrap teal-u-items-baseline teal-u-gap-x-2 teal-u-text-sm">
            <span className="teal-u-font-semibold teal-u-text-on-surface">{comment.author}</span>
            {comment.timestamp !== undefined ? (
              <time
                dateTime={(comment.timestamp instanceof Date ? comment.timestamp : new Date(comment.timestamp)).toISOString()}
                className="teal-u-text-xs teal-u-text-on-surface-variant"
              >
                {formatTime(comment.timestamp)}
              </time>
            ) : null}
          </p>
          <p className="teal-u-mt-0.5 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface">{comment.body}</p>
          <div className="teal-u-mt-1 teal-u-flex teal-u-items-center teal-u-gap-1">
            {onReply ? (
              <button
                type="button"
                aria-label={`Reply to ${comment.author}`}
                onClick={() => onReply(comment)}
                className="teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-md teal-u-px-1.5 teal-u-py-0.5 teal-u-text-xs teal-u-font-semibold teal-u-text-primary hover:teal-u-bg-surface-container-high"
              >
                <Reply aria-hidden="true" className="teal-u-size-3.5" />
                Reply
              </button>
            ) : null}
            {hasReplies ? (
              <button
                type="button"
                aria-expanded={expanded}
                aria-label={expanded ? `Collapse replies to ${comment.author}` : `Show replies to ${comment.author}`}
                onClick={() => setExpanded((value) => !value)}
                className="teal-focus-ring teal-u-inline-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-md teal-u-px-1.5 teal-u-py-0.5 teal-u-text-xs teal-u-font-semibold teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high"
              >
                {expanded ? (
                  <ChevronDown aria-hidden="true" className="teal-u-size-3.5" />
                ) : (
                  <ChevronRight aria-hidden="true" className="teal-u-size-3.5" />
                )}
                {expanded ? 'Collapse' : `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {hasReplies && expanded ? (
        <ul className="teal-u-mt-3 teal-u-flex teal-u-flex-col teal-u-gap-3">
          {replies.map((reply) => (
            <CommentNode key={reply.id} comment={reply} depth={depth + 1} formatTime={formatTime} onReply={onReply} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export const CommentThread = forwardRef<HTMLDivElement, CommentThreadProps>(function CommentThread(
  { className, comments, formatTime = defaultFormatTime, label = 'Comments', onReply, ...props },
  ref,
) {
  return (
    <div ref={ref} aria-label={label} className={cn('teal-u-flex teal-u-flex-col', className)} {...props}>
      <ul className="teal-u-flex teal-u-flex-col teal-u-gap-4">
        {comments.map((comment) => (
          <CommentNode key={comment.id} comment={comment} depth={0} formatTime={formatTime} onReply={onReply} />
        ))}
      </ul>
    </div>
  )
})
