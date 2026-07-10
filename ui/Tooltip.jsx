import { cn } from './cn.js'

const SIDES = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
}

export function Tooltip({ content, side = 'top', children, className = '' }) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-inverse-surface px-2.5 py-1.5 text-xs font-medium text-inverse-on-surface opacity-0 shadow-sm transition delay-75 duration-150',
          'group-hover:opacity-100 group-focus-within:opacity-100',
          SIDES[side] || SIDES.top,
        )}
      >
        {content}
      </span>
    </span>
  )
}
