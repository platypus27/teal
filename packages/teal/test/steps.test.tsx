import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Steps } from '../src/Steps'

const steps = [
  { label: 'Account', description: 'Basic details' },
  { label: 'Workspace' },
  { label: 'Review' },
]

describe('Steps', () => {
  it('renders all steps with numbers for current and upcoming steps', () => {
    render(<Steps steps={steps} current={1} />)

    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    // Completed step shows a check icon instead of its number.
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('marks the current step with aria-current="step"', () => {
    render(<Steps steps={steps} current={1} />)

    const current = screen.getByText('Workspace').closest('li')
    expect(current).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText('Account').closest('li')).not.toHaveAttribute('aria-current')
    expect(screen.getByText('Review').closest('li')).not.toHaveAttribute('aria-current')
  })

  it('calls onStepClick only for completed steps', async () => {
    const user = userEvent.setup()
    const onStepClick = vi.fn()
    render(<Steps steps={steps} current={1} onStepClick={onStepClick} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)

    await user.click(buttons[0] as HTMLElement)
    expect(onStepClick).toHaveBeenCalledWith(0)
  })

  it('renders no buttons without onStepClick', () => {
    render(<Steps steps={steps} current={1} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
