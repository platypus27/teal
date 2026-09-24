import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { useControllableState } from './use-controllable-state'
import { Bold, Heading2, Italic, Link as LinkIcon, List } from 'lucide-react'
import { cn } from './cn'
import { fieldVariants } from './Input'
import { Announcer } from './Announcer'

export interface RichTextEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Accessible name for the text area when there is no visible label. */
  'aria-label'?: string
  /** Initial markdown when uncontrolled. */
  defaultValue?: string
  /** Visible label rendered above the editor. */
  label?: ReactNode
  /** Called with the full markdown whenever it changes. */
  onChange?: (value: string) => void
  /** Placeholder text of the text area. */
  placeholder?: string
  /** Renders a live preview pane next to the text area. */
  preview?: boolean
  /** Visible height of the text area in rows. */
  rows?: number
  /** Controlled markdown. */
  value?: string
}

interface Selection {
  end: number
  start: number
}

type WrapOutcome = 'applied' | 'removed'

interface EditorAction {
  icon: typeof Bold
  keyshortcuts?: string
  label: string
  onClick: () => void
  pressed?: boolean
}

/** Renders inline markdown (`**bold**`, `*italic*`, `[label](href)`) as React nodes. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let key = 0
  let match = pattern.exec(text)
  while (match !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      if (link) {
        nodes.push(
          <a key={key} href={link[2]} className="teal-u-font-semibold teal-u-text-primary teal-u-underline teal-u-underline-offset-2">
            {link[1]}
          </a>,
        )
      }
    }
    key += 1
    lastIndex = match.index + token.length
    match = pattern.exec(text)
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

/** Renders a small markdown subset (headings, lists, paragraphs, inline marks) without any dependency. */
function renderMarkdown(markdown: string): ReactNode {
  const blocks: ReactNode[] = []
  let paragraph: string[] = []
  let list: string[] = []
  let key = 0

  function flushParagraph() {
    if (paragraph.length === 0) return
    blocks.push(
      <p key={key} className="teal-u-leading-relaxed">
        {renderInline(paragraph.join(' '))}
      </p>,
    )
    key += 1
    paragraph = []
  }

  function flushList() {
    if (list.length === 0) return
    const items = list
    blocks.push(
      <ul key={key} className="teal-u-list-disc teal-u-space-y-1 teal-u-ps-5">
        {items.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>,
    )
    key += 1
    list = []
  }

  for (const line of markdown.split('\n')) {
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    const listItem = /^-\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      const Tag = `h${Math.min((heading[1] ?? '#').length + 1, 6)}` as 'h2' | 'h3' | 'h4' | 'h5'
      blocks.push(
        <Tag key={key} className="teal-u-font-semibold teal-u-text-on-surface">
          {renderInline(heading[2] ?? '')}
        </Tag>,
      )
      key += 1
    } else if (listItem) {
      flushParagraph()
      list.push(listItem[1] ?? '')
    } else if (line.trim() === '') {
      flushParagraph()
      flushList()
    } else {
      flushList()
      paragraph.push(line)
    }
  }
  flushParagraph()
  flushList()

  if (blocks.length === 0) return <p className="teal-u-text-on-surface-variant">Nothing to preview</p>
  return blocks
}

/**
 * Lightweight markdown editor: the toolbar wraps the text area selection with
 * markdown syntax, and an optional pane previews the rendered result. Editing
 * stays in a plain textarea — there is no contentEditable surface.
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(function RichTextEditor(
  { 'aria-label': ariaLabel, className, defaultValue, id, label, onChange, placeholder, preview = false, rows = 8, value, ...props },
  ref,
) {
  const generatedId = useId()
  const controlId = id ?? `teal-rich-text-editor-${generatedId.replaceAll(':', '')}`

  const [currentValue, setInternalValue] = useControllableState(value, defaultValue ?? '')
  // Mirrors the textarea selection so toggle buttons can report pressed state.
  const [selection, setSelection] = useState<Selection>({ end: 0, start: 0 })
  const [announcement, setAnnouncement] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const pendingSelection = useRef<Selection | null>(null)

  useEffect(() => {
    const selection = pendingSelection.current
    if (selection === null) return
    pendingSelection.current = null
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.focus()
    textarea.setSelectionRange(selection.start, selection.end)
  })

  function commit(next: string, selection: Selection) {
    setInternalValue(next)
    onChange?.(next)
    pendingSelection.current = selection
    setSelection(selection)
  }

  function announce(label: string, outcome: WrapOutcome | undefined) {
    if (outcome !== undefined) setAnnouncement(`${label} ${outcome}`)
  }

  /** Wraps the selection with `marker`, or unwraps it when already wrapped. */
  function toggleWrap(marker: string): WrapOutcome | undefined {
    const textarea = textareaRef.current
    if (!textarea) return undefined
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = currentValue.slice(start, end)
    const before = currentValue.slice(0, start)
    const after = currentValue.slice(end)
    if (before.endsWith(marker) && after.startsWith(marker)) {
      commit(before.slice(0, -marker.length) + selected + after.slice(marker.length), {
        start: start - marker.length,
        end: end - marker.length,
      })
      return 'removed'
    }
    commit(before + marker + selected + marker + after, {
      start: start + marker.length,
      end: end + marker.length,
    })
    return 'applied'
  }

  /** Adds or removes `prefix` at the start of every line touched by the selection. */
  function toggleLinePrefix(prefix: string): WrapOutcome | undefined {
    const textarea = textareaRef.current
    if (!textarea) return undefined
    const lineStart = currentValue.lastIndexOf('\n', textarea.selectionStart - 1) + 1
    const selectionEnd = textarea.selectionEnd
    const lineEndIndex = currentValue.indexOf('\n', selectionEnd)
    const lineEnd = lineEndIndex === -1 ? currentValue.length : lineEndIndex
    const block = currentValue.slice(lineStart, lineEnd)
    const lines = block.split('\n')
    const allPrefixed = lines.every((line) => line.trim() === '' || line.startsWith(prefix))
    const nextBlock = lines
      .map((line) => {
        if (line.trim() === '') return line
        return allPrefixed ? line.slice(prefix.length) : prefix + line
      })
      .join('\n')
    commit(currentValue.slice(0, lineStart) + nextBlock + currentValue.slice(lineEnd), {
      start: lineStart,
      end: lineStart + nextBlock.length,
    })
    return allPrefixed ? 'removed' : 'applied'
  }

  /** Turns the selection into a markdown link and selects the placeholder URL. */
  function insertLink() {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = currentValue.slice(start, end) || 'link text'
    const url = 'https://'
    commit(`${currentValue.slice(0, start)}[${text}](${url})${currentValue.slice(end)}`, {
      start: start + text.length + 3,
      end: start + text.length + 3 + url.length,
    })
  }

  /** Whether the selection already sits inside `marker` on both sides. */
  function isWrapActive(marker: string) {
    return (
      currentValue.slice(Math.max(0, selection.start - marker.length), selection.start) === marker &&
      currentValue.slice(selection.end, selection.end + marker.length) === marker
    )
  }

  /** Whether the first line touched by the selection starts with `prefix`. */
  function isLinePrefixActive(prefix: string) {
    const lineStart = currentValue.lastIndexOf('\n', selection.start - 1) + 1
    const lineEndIndex = currentValue.indexOf('\n', lineStart)
    const line = currentValue.slice(lineStart, lineEndIndex === -1 ? currentValue.length : lineEndIndex)
    return line.startsWith(prefix)
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!event.metaKey && !event.ctrlKey) return
    if (event.key === 'b' || event.key === 'B') {
      event.preventDefault()
      announce('Bold', toggleWrap('**'))
    } else if (event.key === 'i' || event.key === 'I') {
      event.preventDefault()
      announce('Italic', toggleWrap('*'))
    }
  }

  const actions: EditorAction[] = [
    {
      icon: Bold,
      label: 'Bold',
      pressed: isWrapActive('**'),
      keyshortcuts: 'Meta+B Control+B',
      onClick: () => announce('Bold', toggleWrap('**')),
    },
    {
      icon: Italic,
      label: 'Italic',
      pressed: isWrapActive('*'),
      keyshortcuts: 'Meta+I Control+I',
      onClick: () => announce('Italic', toggleWrap('*')),
    },
    {
      icon: Heading2,
      label: 'Heading',
      pressed: isLinePrefixActive('## '),
      onClick: () => announce('Heading', toggleLinePrefix('## ')),
    },
    {
      icon: List,
      label: 'Bulleted list',
      pressed: isLinePrefixActive('- '),
      onClick: () => announce('Bulleted list', toggleLinePrefix('- ')),
    },
    {
      icon: LinkIcon,
      label: 'Insert link',
      onClick: () => {
        insertLink()
        setAnnouncement('Link inserted')
      },
    },
  ]

  return (
    <div ref={ref} className={cn('teal-u-grid teal-u-gap-1.5', className)} {...props}>
      {label !== undefined && label !== null ? (
        <label htmlFor={controlId} className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface">
          {label}
        </label>
      ) : null}
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="teal-u-flex teal-u-items-center teal-u-gap-1 teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface-container-low teal-u-p-1"
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            aria-label={action.label}
            aria-pressed={action.pressed}
            aria-keyshortcuts={action.keyshortcuts}
            onMouseDown={(event) => event.preventDefault()}
            onClick={action.onClick}
            className="teal-focus-ring teal-u-inline-flex teal-u-size-8 teal-u-items-center teal-u-justify-center teal-u-rounded-lg teal-u-text-on-surface-variant hover:teal-u-bg-surface-container-high hover:teal-u-text-on-surface aria-pressed:teal-u-bg-primary/10 aria-pressed:teal-u-text-primary"
          >
            <action.icon aria-hidden="true" className="teal-u-size-[var(--teal-icon-sm)]" />
          </button>
        ))}
      </div>
      <div className={cn('teal-u-grid teal-u-gap-3', preview && 'md:teal-u-grid-cols-2')}>
        <textarea
          ref={textareaRef}
          id={controlId}
          value={currentValue}
          rows={rows}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(event) => {
            setInternalValue(event.target.value)
            onChange?.(event.target.value)
          }}
          onKeyDown={handleTextareaKeyDown}
          onSelect={(event) => {
            const textarea = event.currentTarget
            setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd })
          }}
          className={cn(fieldVariants(), 'teal-u-resize-y teal-u-font-mono teal-u-leading-relaxed')}
        />
        {preview ? (
          <div
            role="region"
            aria-label="Preview"
            className="teal-u-grid teal-u-content-start teal-u-gap-2 teal-u-rounded-xl teal-u-border teal-u-border-solid teal-u-border-[color:var(--teal-border-subtle)] teal-u-bg-surface teal-u-p-4 teal-u-text-sm teal-u-text-on-surface"
          >
            {renderMarkdown(currentValue)}
          </div>
        ) : null}
      </div>
      <Announcer message={announcement} />
    </div>
  )
})
