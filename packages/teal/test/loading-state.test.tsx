import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { LoadingState, Skeleton, Spinner } from '../src/LoadingState'

describe('Spinner', () => {
  it('announces a default label through role="status"', () => {
    render(<Spinner />)

    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('supports a custom label, size, and ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Spinner ref={ref} label="Fetching households" size="lg" data-testid="spinner" />)

    expect(screen.getByRole('status', { name: 'Fetching households' })).toHaveAttribute('data-testid', 'spinner')
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})

describe('LoadingState', () => {
  it('renders a labelled status region', () => {
    render(<LoadingState label="Loading projects" data-testid="state" />)

    expect(screen.getByRole('status', { name: 'Loading projects' })).toHaveAttribute('data-testid', 'state')
  })

  it('forwards its ref and merges className', () => {
    const ref = createRef<HTMLDivElement>()
    render(<LoadingState ref={ref} className="extra" />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('extra')
  })
})

describe('Skeleton', () => {
  it('renders a decorative pulse block that is hidden from assistive tech', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} data-testid="bone" />)

    expect(screen.getByTestId('bone')).toHaveAttribute('aria-hidden', 'true')
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
