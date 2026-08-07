import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export const AppShell = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AppShell(
  { className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('teal-u-grid teal-u-min-h-dvh teal-u-bg-surface teal-u-text-on-surface', className)}
      style={{
        gridTemplateAreas: '"header header" "sidebar main" "footer footer"',
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        gridTemplateRows: 'auto minmax(0, 1fr) auto',
        ...style,
      }}
      {...props}
    />
  )
})

export const AppShellHeader = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellHeader(
  { className, style, ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn('teal-u-border-b teal-u-border-solid teal-u-border-outline-variant/30 teal-u-bg-surface', className)}
      style={{ gridArea: 'header', ...style }}
      {...props}
    />
  )
})

export interface AppShellSidebarProps extends HTMLAttributes<HTMLElement> {
  /** Width of the sidebar column (e.g. 240 or '16rem'). */
  width?: number | string
}

export const AppShellSidebar = forwardRef<HTMLElement, AppShellSidebarProps>(function AppShellSidebar(
  { className, style, width = 256, ...props },
  ref,
) {
  return (
    <aside
      ref={ref}
      className={cn('teal-u-border-r teal-u-border-solid teal-u-border-outline-variant/30 teal-u-bg-surface', className)}
      style={{ gridArea: 'sidebar', width: typeof width === 'number' ? `${width}px` : width, ...style }}
      {...props}
    />
  )
})

export const AppShellMain = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellMain(
  { className, style, ...props },
  ref,
) {
  return (
    <main
      ref={ref}
      className={cn('teal-u-min-w-0', className)}
      style={{ gridArea: 'main', ...style }}
      {...props}
    />
  )
})

export const AppShellFooter = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellFooter(
  { className, style, ...props },
  ref,
) {
  return (
    <footer
      ref={ref}
      className={cn('teal-u-border-t teal-u-border-solid teal-u-border-outline-variant/30 teal-u-bg-surface', className)}
      style={{ gridArea: 'footer', ...style }}
      {...props}
    />
  )
})
