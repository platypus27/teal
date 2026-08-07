import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react'
import { cn } from './cn'

export interface KanbanCard {
  /** Optional secondary text shown below the title. */
  description?: string
  /** Stable, unique id for the card. */
  id: string
  /** Visible title of the card. */
  title: string
}

export interface KanbanColumn {
  /** Cards rendered in this column, top to bottom. */
  cards: KanbanCard[]
  /** Stable, unique id for the column. */
  id: string
  /** Visible heading of the column. */
  title: string
}

interface CardLocation {
  cardIndex: number
  columnIndex: number
}

export interface KanbanBoardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Controlled columns. When provided, the board never mutates its own state. */
  columns?: KanbanColumn[]
  /** Initial columns when uncontrolled. */
  defaultColumns?: KanbanColumn[]
  /** Accessible name for the board region. */
  label?: string
  /** Called with the next columns whenever a card is moved. */
  onColumnsChange?: (columns: KanbanColumn[]) => void
}

/**
 * A column-based board. Arrow keys move focus between cards and columns;
 * Enter or Space grabs a card, arrows move the grabbed card, Enter or Space
 * drops it, and Escape cancels the grab.
 */
export const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(function KanbanBoard(
  { className, columns, defaultColumns = [], label = 'Kanban board', onColumnsChange, ...props },
  ref,
) {
  const boardId = useId()
  const [internalColumns, setInternalColumns] = useState(defaultColumns)
  const board = columns ?? internalColumns
  const [grabbedId, setGrabbedId] = useState<string | undefined>(undefined)
  const [activeId, setActiveId] = useState<string | undefined>(undefined)
  // Bumped whenever a grabbed card moves so focus follows it across parents.
  const [focusTick, setFocusTick] = useState(0)
  const cardRefs = useRef(new Map<string, HTMLButtonElement>())

  useEffect(() => {
    if (activeId !== undefined) cardRefs.current.get(activeId)?.focus()
  }, [activeId, focusTick])

  function locate(cardId: string): CardLocation | undefined {
    for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
      const column = board[columnIndex]
      if (column === undefined) continue
      const cardIndex = column.cards.findIndex((card) => card.id === cardId)
      if (cardIndex !== -1) return { cardIndex, columnIndex }
    }
    return undefined
  }

  function commit(next: KanbanColumn[]) {
    if (columns === undefined) setInternalColumns(next)
    onColumnsChange?.(next)
  }

  function requestFocus(cardId: string) {
    setActiveId(cardId)
    setFocusTick((tick) => tick + 1)
  }

  function moveCard(cardId: string, targetColumnIndex: number, targetCardIndex: number) {
    const from = locate(cardId)
    if (from === undefined) return
    const next = board.map((column) => ({ ...column, cards: [...column.cards] }))
    const source = next[from.columnIndex]
    const target = next[targetColumnIndex]
    if (source === undefined || target === undefined) return
    const [card] = source.cards.splice(from.cardIndex, 1)
    if (card === undefined) return
    target.cards.splice(Math.min(targetCardIndex, target.cards.length), 0, card)
    commit(next)
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLButtonElement>, cardId: string) {
    const location = locate(cardId)
    if (location === undefined) return
    const { cardIndex, columnIndex } = location
    const column = board[columnIndex]
    if (column === undefined) return
    const grabbed = grabbedId === cardId

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setGrabbedId(grabbed ? undefined : cardId)
      return
    }
    if (event.key === 'Escape') {
      if (grabbed) {
        event.preventDefault()
        setGrabbedId(undefined)
      }
      return
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const delta = event.key === 'ArrowUp' ? -1 : 1
      const nextIndex = cardIndex + delta
      if (nextIndex < 0 || nextIndex >= column.cards.length) return
      if (grabbed) {
        moveCard(cardId, columnIndex, nextIndex)
        requestFocus(cardId)
      } else {
        const nextCard = column.cards[nextIndex]
        if (nextCard !== undefined) requestFocus(nextCard.id)
      }
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const delta = event.key === 'ArrowLeft' ? -1 : 1
      const target = board[columnIndex + delta]
      if (target === undefined) return
      if (grabbed) {
        moveCard(cardId, columnIndex + delta, cardIndex)
        requestFocus(cardId)
      } else {
        const targetCard = target.cards[Math.min(cardIndex, target.cards.length - 1)]
        if (targetCard !== undefined) requestFocus(targetCard.id)
      }
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const targetCard = event.key === 'Home' ? column.cards[0] : column.cards[column.cards.length - 1]
      if (targetCard !== undefined) requestFocus(targetCard.id)
    }
  }

  // The active card keeps the tab stop; otherwise the first card on the board is tabbable.
  const firstCard = board.flatMap((column) => column.cards)[0]
  const tabbableId = activeId !== undefined && locate(activeId) !== undefined ? activeId : firstCard?.id

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className={cn('teal-u-flex teal-u-gap-4 teal-u-overflow-x-auto teal-u-p-1', className)}
      {...props}
    >
      {board.map((column) => (
        <section
          key={column.id}
          aria-labelledby={`${boardId}-${column.id}-heading`}
          className="teal-u-flex teal-u-w-64 teal-u-shrink-0 teal-u-flex-col teal-u-rounded-2xl teal-u-bg-surface-container teal-u-p-3"
        >
          <h3
            id={`${boardId}-${column.id}-heading`}
            className="teal-u-text-sm teal-u-font-semibold teal-u-text-on-surface"
          >
            {column.title}
            <span className="teal-u-ml-1.5 teal-u-font-normal teal-u-text-on-surface-variant">{column.cards.length}</span>
          </h3>
          <ul className="teal-u-mt-3 teal-u-flex teal-u-flex-1 teal-u-flex-col teal-u-gap-2">
            {column.cards.map((card) => (
              <li key={card.id}>
                <button
                  ref={(node) => {
                    if (node) cardRefs.current.set(card.id, node)
                    else cardRefs.current.delete(card.id)
                  }}
                  type="button"
                  aria-pressed={grabbedId === card.id}
                  tabIndex={card.id === tabbableId ? 0 : -1}
                  onKeyDown={(event) => handleCardKeyDown(event, card.id)}
                  onFocus={() => setActiveId(card.id)}
                  className={cn(
                    'teal-focus-ring teal-u-w-full teal-u-rounded-xl teal-u-border teal-u-border-outline-variant/30 teal-u-bg-surface teal-u-p-3 teal-u-text-left',
                    grabbedId === card.id && 'teal-u-border-primary teal-u-shadow-lg',
                  )}
                >
                  <span className="teal-u-block teal-u-text-sm teal-u-font-medium teal-u-text-on-surface">{card.title}</span>
                  {card.description !== undefined ? (
                    <span className="teal-u-mt-1 teal-u-block teal-u-text-xs teal-u-text-on-surface-variant">
                      {card.description}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
})
