import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { useRef, useState, createRef } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  EmptyState,
  LoadingState,
  PageHeader,
  Toaster,
  Tooltip,
  TooltipProvider,
  dismissToast,
  toast,
} from '../src/index'

describe('display modules', () => {
  it('provides structural card and page heading semantics', () => {
    render(
      <>
        <PageHeader title="Settings" subtitle="Manage your account" />
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Public information</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
        <Badge variant="danger">Action required</Badge>
      </>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByText('Action required')).toBeInTheDocument()
  })

  it('supports actionable empty states and named loading states', () => {
    render(
      <>
        <EmptyState title="No reports" action={<Button>Create report</Button>} />
        <LoadingState label="Loading reports" />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Create report' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Loading reports' })).toBeInTheDocument()
  })

  it('hides custom empty-state icons from assistive technology', () => {
    render(<EmptyState title="No reports" icon={<svg data-testid="custom-icon" />} />)
    expect(screen.getByTestId('custom-icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('adjusts heading levels to the page outline with titleAs', () => {
    render(
      <>
        <PageHeader title="Reports" titleAs="h2" />
        <Card>
          <CardHeader>
            <CardTitle titleAs="h3">Usage</CardTitle>
          </CardHeader>
        </Card>
        <EmptyState title="No data" titleAs="h4" />
      </>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Reports' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Usage' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'No data' })).toBeInTheDocument()
  })

  it('blocks disabled interactive cards from focus and activation', async () => {
    const user = userEvent.setup()
    const onLinkClick = vi.fn()
    render(
      <>
        <button type="button">Before</button>
        <Card as="button" disabled>
          Disabled button card
        </Card>
        <Card as="a" href="/reports" disabled onClick={onLinkClick}>
          Disabled link card
        </Card>
        <button type="button">After</button>
      </>,
    )
    const button = screen.getByRole('button', { name: 'Disabled button card' })
    expect(button).toBeDisabled()
    const link = screen.getByRole('link', { name: 'Disabled link card' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).not.toHaveAttribute('disabled')
    expect(link.className).toContain('pointer-events-none')

    fireEvent.click(link)
    expect(onLinkClick).not.toHaveBeenCalled()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })
})

describe('overlays and feedback', () => {
  it('restores focus to an external trigger after a controlled dialog closes', async () => {
    const user = userEvent.setup()

    function ControlledDialog() {
      const [open, setOpen] = useState(false)
      const triggerRef = useRef<HTMLButtonElement>(null)
      return (
        <>
          <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>Archive route</button>
          <Dialog open={open} onOpenChange={setOpen} restoreFocusRef={triggerRef} title="Archive route?">
            Route details
          </Dialog>
        </>
      )
    }

    render(<ControlledDialog />)
    const trigger = screen.getByRole('button', { name: 'Archive route' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('gives dialogs their title and restores controlled close intent', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog
        open
        onOpenChange={onOpenChange}
        title="Archive project?"
        description="You can restore it later."
      >
        Project details
      </Dialog>,
    )

    expect(screen.getByRole('dialog', { name: 'Archive project?' })).toHaveAccessibleDescription(
      'You can restore it later.',
    )
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('associates tooltips with their trigger', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Refresh results" delayDuration={0}>
        <button type="button">Refresh</button>
      </Tooltip>,
    )
    await user.hover(screen.getByRole('button', { name: 'Refresh' }))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Refresh results')
  })

  it('groups tooltips under a shared TooltipProvider', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0} disableHoverableContent>
        <Tooltip content="First tip">
          <button type="button">First</button>
        </Tooltip>
        <Tooltip content="Second tip">
          <button type="button">Second</button>
        </Tooltip>
      </TooltipProvider>,
    )
    await user.hover(screen.getByRole('button', { name: 'First' }))
    expect(await screen.findByRole('tooltip', { name: 'First tip' })).toBeInTheDocument()
    await user.hover(screen.getByRole('button', { name: 'Second' }))
    expect(await screen.findByRole('tooltip', { name: 'Second tip' })).toBeInTheDocument()
  })

  it('announces and dismisses imperative toast messages', () => {
    render(<Toaster />)
    let id = ''
    act(() => {
      id = toast({ title: 'Changes saved', variant: 'success', duration: Infinity })
    })
    expect(screen.getByText('Changes saved')).toBeInTheDocument()
    act(() => dismissToast(id))
    expect(screen.queryByText('Changes saved')).not.toBeInTheDocument()
  })

  it('forwards the toaster ref to its viewport', () => {
    const ref = createRef<HTMLOListElement>()
    render(<Toaster ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLOListElement)
  })

  it('renders portal-backed roots safely during SSR', () => {
    expect(() => renderToString(<Toaster />)).not.toThrow()
    expect(() => renderToString(<Dialog open title="Server dialog">Content</Dialog>)).not.toThrow()
  })
})


describe('alert and avatar', () => {
  it('announces alerts with roles matching their urgency', () => {
    render(
      <>
        <Alert variant="info" title="Heads up">
          Info body
        </Alert>
        <Alert variant="danger" title="Save failed">
          Danger body
        </Alert>
      </>,
    )
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('alert')).toHaveTextContent('Danger body')
  })

  it('dismisses alerts through the close button', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert variant="warning" title="Careful" onDismiss={onDismiss}>
        Body
      </Alert>,
    )
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('falls back to initials and names the avatar', () => {
    render(<Avatar name="Ada Lovelace" />)
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL')
  })

  it('renders the image with alt text and falls back on load error', () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />)
    fireEvent.error(screen.getByRole('img', { name: 'Ada Lovelace' }))
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL')
  })

  it('retries image rendering when the source changes after an error', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" src="/broken.png" />)
    fireEvent.error(screen.getByRole('img', { name: 'Ada Lovelace' }))

    rerender(<Avatar name="Ada Lovelace" src="/ada.png" />)

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute('src', '/ada.png')
  })

  it('stays decorative without a name', () => {
    const { container } = render(<Avatar />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
