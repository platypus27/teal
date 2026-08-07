import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

export interface MarkdownViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Markdown source. Supports headings, bold, italic, links, lists, inline code, fenced code blocks, blockquotes, and horizontal rules. Raw HTML is rendered as literal text. */
  content: string
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'code'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: Array<string> }
  | { type: 'ol'; items: Array<string> }
  | { type: 'hr' }
  | { type: 'p'; text: string }

const headingPattern = /^(#{1,6})\s+(.*)$/
const hrPattern = /^\s*([-*_]\s*){3,}$/
const quotePattern = /^\s*>\s?/
const ulPattern = /^\s*[-*+]\s+/
const olPattern = /^\s*\d+\.\s+/
const fencePattern = /^\s*```/

function isBlockStart(line: string): boolean {
  return (
    fencePattern.test(line) ||
    headingPattern.test(line) ||
    hrPattern.test(line) ||
    quotePattern.test(line) ||
    ulPattern.test(line) ||
    olPattern.test(line)
  )
}

function parseBlocks(content: string): Array<Block> {
  const lines = content.split('\n')
  const blocks: Array<Block> = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]!
    if (line.trim() === '') {
      i++
      continue
    }
    if (fencePattern.test(line)) {
      const buf: Array<string> = []
      i++
      while (i < lines.length && !fencePattern.test(lines[i]!)) {
        buf.push(lines[i]!)
        i++
      }
      i++
      blocks.push({ type: 'code', text: buf.join('\n') })
      continue
    }
    const heading = headingPattern.exec(line)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1]!.length, text: heading[2]! })
      i++
      continue
    }
    if (hrPattern.test(line)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }
    if (quotePattern.test(line)) {
      const buf: Array<string> = []
      while (i < lines.length && quotePattern.test(lines[i]!)) {
        buf.push(lines[i]!.replace(quotePattern, ''))
        i++
      }
      blocks.push({ type: 'quote', text: buf.join(' ') })
      continue
    }
    if (ulPattern.test(line)) {
      const items: Array<string> = []
      while (i < lines.length && ulPattern.test(lines[i]!)) {
        items.push(lines[i]!.replace(ulPattern, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }
    if (olPattern.test(line)) {
      const items: Array<string> = []
      while (i < lines.length && olPattern.test(lines[i]!)) {
        items.push(lines[i]!.replace(olPattern, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }
    const buf: Array<string> = []
    while (i < lines.length && lines[i]!.trim() !== '' && !isBlockStart(lines[i]!)) {
      buf.push(lines[i]!)
      i++
    }
    blocks.push({ type: 'p', text: buf.join(' ') })
  }
  return blocks
}

function isSafeUrl(url: string): boolean {
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url)
}

const inlinePattern =
  /(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)\s]+)\))/g

function renderInline(text: string): Array<ReactNode> {
  const nodes: Array<ReactNode> = []
  let last = 0
  let key = 0
  for (const match of text.matchAll(inlinePattern)) {
    const raw = match[0]
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const bold = match[2] ?? match[4]
    const italic = match[6] ?? match[8]
    const code = match[10]
    const linkText = match[12]
    const linkUrl = match[13]
    if (bold !== undefined) {
      nodes.push(
        <strong key={key++} className="teal-u-font-semibold">
          {bold}
        </strong>,
      )
    } else if (italic !== undefined) {
      nodes.push(<em key={key++}>{italic}</em>)
    } else if (code !== undefined) {
      nodes.push(
        <code
          key={key++}
          className="teal-u-rounded teal-u-bg-surface-container-high teal-u-px-1 teal-u-py-0.5 teal-u-font-mono teal-u-text-[0.9em]"
        >
          {code}
        </code>,
      )
    } else if (linkText !== undefined && linkUrl !== undefined && isSafeUrl(linkUrl)) {
      nodes.push(
        <a
          key={key++}
          href={linkUrl}
          className="teal-u-font-medium teal-u-text-primary teal-u-underline teal-u-underline-offset-2"
        >
          {linkText}
        </a>,
      )
    } else {
      nodes.push(raw)
    }
    last = match.index + raw.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const headingClasses: Record<number, string> = {
  1: 'teal-u-text-2xl teal-u-font-bold',
  2: 'teal-u-text-xl teal-u-font-bold',
  3: 'teal-u-text-lg teal-u-font-semibold',
  4: 'teal-u-text-base teal-u-font-semibold',
  5: 'teal-u-text-sm teal-u-font-semibold',
  6: 'teal-u-text-xs teal-u-font-semibold teal-u-uppercase teal-u-tracking-wider',
}

function renderBlock(block: Block, index: number): ReactNode {
  switch (block.type) {
    case 'heading': {
      const level = Math.min(6, Math.max(1, block.level))
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return (
        <Tag key={index} className={cn('teal-u-font-headline teal-u-text-on-surface', headingClasses[level])}>
          {renderInline(block.text)}
        </Tag>
      )
    }
    case 'code':
      return (
        <pre
          key={index}
          className="teal-u-overflow-x-auto teal-u-rounded-lg teal-u-bg-surface-container-high teal-u-p-3 teal-u-font-mono teal-u-text-[0.9em] teal-u-text-on-surface"
        >
          <code>{block.text}</code>
        </pre>
      )
    case 'quote':
      return (
        <blockquote
          key={index}
          className="teal-u-border-0 teal-u-border-l-4 teal-u-border-solid teal-u-border-primary/40 teal-u-pl-3 teal-u-italic teal-u-text-on-surface-variant"
        >
          {renderInline(block.text)}
        </blockquote>
      )
    case 'ul':
      return (
        <ul key={index} className="teal-u-list-disc teal-u-pl-6">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={index} className="teal-u-list-decimal teal-u-pl-6">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    case 'hr':
      return <hr key={index} className="teal-u-border-0 teal-u-border-t teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)]" />
    case 'p':
      return <p key={index}>{renderInline(block.text)}</p>
  }
}

export const MarkdownView = forwardRef<HTMLDivElement, MarkdownViewProps>(function MarkdownView(
  { className, content, ...props },
  ref,
) {
  const blocks = useMemo(() => parseBlocks(content), [content])
  return (
    <div
      ref={ref}
      className={cn('teal-u-flex teal-u-flex-col teal-u-gap-3 teal-u-text-sm teal-u-leading-relaxed teal-u-text-on-surface', className)}
      {...props}
    >
      {blocks.map(renderBlock)}
    </div>
  )
})
