import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { useRef, useState } from 'react'
import {
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
        <Badge tone="danger">Action required</Badge>
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

  it('announces and dismisses imperative toast messages', () => {
    render(<Toaster />)
    let id = ''
    act(() => {
      id = toast({ title: 'Changes saved', tone: 'success', duration: Infinity })
    })
    expect(screen.getByText('Changes saved')).toBeInTheDocument()
    act(() => dismissToast(id))
    expect(screen.queryByText('Changes saved')).not.toBeInTheDocument()
  })

  it('renders portal-backed roots safely during SSR', () => {
    expect(() => renderToString(<Toaster />)).not.toThrow()
    expect(() => renderToString(<Dialog open title="Server dialog">Content</Dialog>)).not.toThrow()
  })
})
