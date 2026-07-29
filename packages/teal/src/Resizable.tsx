import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useRef,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type RefAttributes,
} from 'react'
import { cn } from './cn'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

interface PanelMeta {
  defaultSize?: number | undefined
  minSize: number
  maxSize: number
}

function computeInitialSizes(metas: PanelMeta[]): number[] {
  const count = metas.length
  if (count === 0) return []
  const defaults = metas.map((meta) => meta.defaultSize)
  const specifiedTotal = defaults.reduce<number>((total, size) => total + (size ?? 0), 0)
  const unspecifiedCount = defaults.filter((size) => size === undefined).length
  const fallback = unspecifiedCount > 0 ? Math.max(0, (100 - specifiedTotal) / unspecifiedCount) : 0
  const sizes = defaults.map((size) => size ?? fallback)
  const total = sizes.reduce((sum, size) => sum + size, 0)
  if (total <= 0) return sizes.map(() => 100 / count)
  return sizes.map((size) => (size / total) * 100)
}

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Initial size as a percentage of the group (0–100). Panels without one share the remaining space. */
  defaultSize?: number
  /** Smallest size the panel can be resized to, in percent; defaults to 0. */
  minSize?: number
  /** Largest size the panel can be resized to, in percent; defaults to 100. */
  maxSize?: number
}

interface InternalPanelProps extends ResizablePanelProps {
  _size?: number
}

const ResizablePanelImpl = forwardRef<HTMLDivElement, InternalPanelProps>(function ResizablePanel(
  { _size, className, style, ...props },
  ref,
) {
  // defaultSize/minSize/maxSize are read by the group; never forward them to the DOM.
  delete props.defaultSize
  delete props.minSize
  delete props.maxSize
  return (
    <div
      ref={ref}
      className={cn('teal-u-overflow-auto', className)}
      style={{ flexGrow: 0, flexShrink: 0, flexBasis: `${_size ?? 0}%`, minWidth: 0, minHeight: 0, ...style }}
      {...props}
    />
  )
})

/** A single pane inside a ResizablePanelGroup. */
export const ResizablePanel = ResizablePanelImpl as React.ForwardRefExoticComponent<
  ResizablePanelProps & RefAttributes<HTMLDivElement>
>

export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
  /** Disables pointer, keyboard and double-click resizing when true. */
  disabled?: boolean
  /** Percentage step applied by arrow-key resizing; defaults to 5. */
  step?: number
}

interface InternalHandleProps extends ResizableHandleProps {
  _index?: number
  _direction?: 'horizontal' | 'vertical'
  _valueNow?: number
  _valueMin?: number
  _valueMax?: number
  _resize?: (handleIndex: number, deltaPercent: number) => void
  _reset?: () => void
  _getContainerSize?: () => number
}

const ResizableHandleImpl = forwardRef<HTMLDivElement, InternalHandleProps>(function ResizableHandle(
  {
    _direction = 'horizontal',
    _getContainerSize,
    _index = 0,
    _reset,
    _resize,
    _valueMax = 100,
    _valueMin = 0,
    _valueNow = 0,
    className,
    disabled = false,
    onDoubleClick,
    onKeyDown,
    onPointerDown,
    step = 5,
    ...props
  },
  ref,
) {
  const dragState = useRef<{ pointerId: number; position: number } | null>(null)
  const horizontal = _direction === 'horizontal'

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return
    dragState.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={horizontal ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(_valueNow)}
      aria-valuemin={_valueMin}
      aria-valuemax={_valueMax}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (disabled || event.defaultPrevented || event.button !== 0) return
        event.preventDefault()
        dragState.current = { pointerId: event.pointerId, position: horizontal ? event.clientX : event.clientY }
        event.currentTarget.setPointerCapture?.(event.pointerId)
      }}
      onPointerMove={(event) => {
        const drag = dragState.current
        if (!drag || drag.pointerId !== event.pointerId || !_resize || !_getContainerSize) return
        const containerSize = _getContainerSize()
        if (containerSize <= 0) return
        const position = horizontal ? event.clientX : event.clientY
        _resize(_index, ((position - drag.position) / containerSize) * 100)
        drag.position = position
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (disabled || event.defaultPrevented || !_resize) return
        if (event.key === (horizontal ? 'ArrowLeft' : 'ArrowUp')) {
          event.preventDefault()
          _resize(_index, -step)
        } else if (event.key === (horizontal ? 'ArrowRight' : 'ArrowDown')) {
          event.preventDefault()
          _resize(_index, step)
        }
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event)
        if (disabled || event.defaultPrevented) return
        _reset?.()
      }}
      className={cn(
        'teal-focus-ring teal-u-flex teal-u-touch-none teal-u-items-center teal-u-justify-center teal-u-bg-outline-variant/40 hover:teal-u-bg-primary/40',
        horizontal ? 'teal-u-w-1 teal-u-cursor-col-resize' : 'teal-u-h-1 teal-u-cursor-row-resize',
        disabled && 'teal-u-pointer-events-none teal-u-opacity-55',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          'teal-u-rounded-full teal-u-bg-outline',
          horizontal ? 'teal-u-h-6 teal-u-w-0.5' : 'teal-u-h-0.5 teal-u-w-6',
        )}
      />
    </div>
  )
})

/** Draggable separator between two ResizablePanels; also supports arrow keys and double-click reset. */
export const ResizableHandle = ResizableHandleImpl as React.ForwardRefExoticComponent<
  ResizableHandleProps & RefAttributes<HTMLDivElement>
>

export interface ResizablePanelGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Axis along which panels are laid out; 'horizontal' (default) places panels side by side. */
  direction?: 'horizontal' | 'vertical'
}

/**
 * Lays out ResizablePanels separated by ResizableHandles, letting users
 * resize the panes with pointer drag, arrow keys or double-click reset.
 * Panels and handles must be direct children of the group.
 */
export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  function ResizablePanelGroup({ children, className, direction = 'horizontal', ...props }, ref) {
    const groupRef = useRef<HTMLDivElement | null>(null)
    const setRefs = (node: HTMLDivElement | null) => {
      groupRef.current = node
      const forwarded = ref as ForwardedRef<HTMLDivElement>
      if (typeof forwarded === 'function') forwarded(node)
      else if (forwarded) forwarded.current = node
    }

    const panelMetas: PanelMeta[] = []
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === ResizablePanel) {
        const panelProps = child.props as ResizablePanelProps
        panelMetas.push({
          defaultSize: panelProps.defaultSize,
          minSize: panelProps.minSize ?? 0,
          maxSize: panelProps.maxSize ?? 100,
        })
      }
    })
    const metasRef = useRef(panelMetas)
    metasRef.current = panelMetas
    const metaKey = panelMetas.map((meta) => `${meta.defaultSize ?? ''}:${meta.minSize}:${meta.maxSize}`).join('|')
    const metaKeyRef = useRef(metaKey)
    metaKeyRef.current = metaKey

    const [state, setState] = useState<{ key: string; sizes: number[] }>(() => ({
      key: metaKey,
      sizes: computeInitialSizes(panelMetas),
    }))
    // When the panel configuration changes, fall back to freshly computed initial sizes.
    const sizes = state.key === metaKey ? state.sizes : computeInitialSizes(panelMetas)

    const resize = useCallback((handleIndex: number, deltaPercent: number) => {
      setState((prev) => {
        const metas = metasRef.current
        const key = metaKeyRef.current
        const baseSizes = prev.key === key ? prev.sizes : computeInitialSizes(metas)
        const before = metas[handleIndex]
        const after = metas[handleIndex + 1]
        const sizeBefore = baseSizes[handleIndex]
        const sizeAfter = baseSizes[handleIndex + 1]
        if (!before || !after || sizeBefore === undefined || sizeAfter === undefined) return prev
        const total = sizeBefore + sizeAfter
        let newBefore = clamp(sizeBefore + deltaPercent, before.minSize, before.maxSize)
        let newAfter = clamp(total - newBefore, after.minSize, after.maxSize)
        newBefore = clamp(total - newAfter, before.minSize, before.maxSize)
        newAfter = total - newBefore
        const next = [...baseSizes]
        next[handleIndex] = newBefore
        next[handleIndex + 1] = newAfter
        return { key, sizes: next }
      })
    }, [])

    const reset = useCallback(() => {
      setState(() => ({ key: metaKeyRef.current, sizes: computeInitialSizes(metasRef.current) }))
    }, [])

    const getContainerSize = useCallback(() => {
      const rect = groupRef.current?.getBoundingClientRect()
      if (!rect) return 0
      return direction === 'horizontal' ? rect.width : rect.height
    }, [direction])

    let panelIndex = -1
    let handleIndex = -1
    const rendered = Children.map(children, (child) => {
      if (!isValidElement(child)) return child
      if (child.type === ResizablePanel) {
        panelIndex += 1
        const index = panelIndex
        return cloneElement(child as ReactElement<InternalPanelProps>, { _size: sizes[index] ?? 0 })
      }
      if (child.type === ResizableHandle) {
        handleIndex += 1
        const index = handleIndex
        const meta = panelMetas[index]
        return cloneElement(child as ReactElement<InternalHandleProps>, {
          _index: index,
          _direction: direction,
          _valueNow: sizes[index] ?? 0,
          _valueMin: meta?.minSize ?? 0,
          _valueMax: meta?.maxSize ?? 100,
          _resize: resize,
          _reset: reset,
          _getContainerSize: getContainerSize,
        })
      }
      return child
    })

    return (
      <div
        ref={setRefs}
        className={cn(
          'teal-u-flex teal-u-size-full',
          direction === 'horizontal' ? 'teal-u-flex-row' : 'teal-u-flex-col',
          className,
        )}
        {...props}
      >
        {rendered}
      </div>
    )
  },
)
