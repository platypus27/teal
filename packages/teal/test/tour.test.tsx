import { fireEvent, render, screen } from '@testing-library/react'
import { Tour, type TourStep } from '../src/Tour'

const steps: TourStep[] = [
  { target: '#nav', title: 'Navigation', content: 'Find your way around here.' },
  { target: '#save', title: 'Save your work', content: 'Click here to save.', placement: 'top' },
  { target: '#share', title: 'Share', content: 'Invite your team.' },
]

function renderTour(props?: Partial<Parameters<typeof Tour>[0]>) {
  return render(
    <>
      <div id="nav">Nav target</div>
      <div id="save">Save target</div>
      <div id="share">Share target</div>
      <Tour steps={steps} open onOpenChange={() => {}} {...props} />
    </>,
  )
}

describe('Tour', () => {
  it('renders the first step with its position counter', () => {
    renderTour()

    expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument()
    expect(screen.getByText('Find your way around here.')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
  })

  it('renders nothing when closed', () => {
    const { container } = render(
      <>
        <div id="nav">Nav target</div>
        <Tour steps={steps} open={false} onOpenChange={() => {}} />
      </>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(container.querySelector('.teal-overlay-surface')).toBeNull()
  })

  it('advances and goes back through the steps', () => {
    renderTour()

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('dialog', { name: 'Save your work' })).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
  })

  it('calls onFinish and closes on the final Done step', () => {
    const onFinish = vi.fn()
    const onOpenChange = vi.fn()
    renderTour({ onFinish, onOpenChange })

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('skips the tour without calling onFinish', () => {
    const onFinish = vi.fn()
    const onOpenChange = vi.fn()
    renderTour({ onFinish, onOpenChange })

    fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onFinish).not.toHaveBeenCalled()
  })

  it('closes on Escape', () => {
    const onOpenChange = vi.fn()
    renderTour({ onOpenChange })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('restarts from the first step when reopened', () => {
    const { rerender } = render(
      <>
        <div id="nav">Nav target</div>
        <Tour steps={steps} open onOpenChange={() => {}} />
      </>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()

    rerender(
      <>
        <div id="nav">Nav target</div>
        <Tour steps={steps} open={false} onOpenChange={() => {}} />
      </>,
    )
    rerender(
      <>
        <div id="nav">Nav target</div>
        <Tour steps={steps} open onOpenChange={() => {}} />
      </>,
    )
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
  })

  it('still shows the step content when the target is missing', () => {
    render(
      <Tour
        steps={[{ target: '#does-not-exist', title: 'Missing', content: 'No target rendered.' }]}
        open
        onOpenChange={() => {}}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Missing' })).toBeInTheDocument()
    expect(screen.getByText('No target rendered.')).toBeInTheDocument()
  })
})
