import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface DiffLine {
  /** Text of the line, without a trailing newline. */
  content: string
  /** Whether the line was added, removed, or kept unchanged. */
  type: 'add' | 'remove' | 'context'
}

export interface DiffViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Pre-computed diff lines; takes precedence over `oldValue`/`newValue`. */
  hunks?: DiffLine[]
  /** Accessible name for the diff. */
  label?: string
  /** Shows old/new line number gutters. */
  lineNumbers?: boolean
  /** New text; diffed against `oldValue` when `hunks` is not provided. */
  newValue?: string
  /** Original text; diffed against `newValue` when `hunks` is not provided. */
  oldValue?: string
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split('\n')
  const b = newText.split('\n')
  const m = a.length
  const n = b.length
  const dp: Array<Array<number>> = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const row = dp[i]!
      const below = dp[i + 1]!
      row[j] = a[i] === b[j] ? below[j + 1]! + 1 : Math.max(below[j]!, row[j + 1]!)
    }
  }
  const lines: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < m && j < n) {
    const aLine = a[i]!
    const bLine = b[j]!
    if (aLine === bLine) {
      lines.push({ type: 'context', content: aLine })
      i++
      j++
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      lines.push({ type: 'remove', content: aLine })
      i++
    } else {
      lines.push({ type: 'add', content: bLine })
      j++
    }
  }
  while (i < m) lines.push({ type: 'remove', content: a[i++]! })
  while (j < n) lines.push({ type: 'add', content: b[j++]! })
  return lines
}

const typeStyles: Record<DiffLine['type'], { row: string; sign: string; marker: string; srLabel: string }> = {
  add: {
    row: 'teal-u-bg-primary/10',
    sign: '+',
    marker: 'teal-u-text-primary',
    srLabel: 'Added:',
  },
  remove: {
    row: 'teal-u-bg-error/10',
    sign: '-',
    marker: 'teal-u-text-error',
    srLabel: 'Removed:',
  },
  context: {
    row: '',
    sign: ' ',
    marker: 'teal-u-text-on-surface-variant',
    srLabel: 'Unchanged:',
  },
}

export const DiffViewer = forwardRef<HTMLDivElement, DiffViewerProps>(function DiffViewer(
  { className, hunks, label = 'Diff', lineNumbers = true, newValue, oldValue, ...props },
  ref,
) {
  const lines = hunks ?? computeDiff(oldValue ?? '', newValue ?? '')

  let oldLine = 0
  let newLine = 0

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn(
        'teal-u-overflow-x-auto teal-u-rounded-lg teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-lowest teal-u-py-1 teal-u-font-mono teal-u-text-sm',
        className,
      )}
      {...props}
    >
      {lines.map((line, index) => {
        if (line.type !== 'add') oldLine += 1
        if (line.type !== 'remove') newLine += 1
        const styles = typeStyles[line.type]
        return (
          <div key={index} className={cn('teal-u-flex teal-u-items-baseline', styles.row)}>
            {lineNumbers ? (
              <>
                <span aria-hidden="true" className="teal-u-w-10 teal-u-shrink-0 teal-u-select-none teal-u-pr-2 teal-u-text-right teal-u-text-on-surface-variant teal-u-opacity-60">
                  {line.type === 'add' ? '' : oldLine}
                </span>
                <span aria-hidden="true" className="teal-u-w-10 teal-u-shrink-0 teal-u-select-none teal-u-pr-2 teal-u-text-right teal-u-text-on-surface-variant teal-u-opacity-60">
                  {line.type === 'remove' ? '' : newLine}
                </span>
              </>
            ) : null}
            <span aria-hidden="true" className={cn('teal-u-w-5 teal-u-shrink-0 teal-u-select-none teal-u-text-center teal-u-font-semibold', styles.marker)}>
              {styles.sign}
            </span>
            <span className="teal-u-sr-only">{styles.srLabel} </span>
            <code className="teal-u-whitespace-pre-wrap teal-u-text-on-surface">{line.content}</code>
          </div>
        )
      })}
    </div>
  )
})
