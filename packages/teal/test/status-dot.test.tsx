import { render, screen } from '@testing-library/react'
import { StatusDot } from '../src/StatusDot'

describe('StatusDot', () => {
  it('renders the text label next to the dot', () => {
    render(<StatusDot variant="success" label="Active" />)

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('hides the dot from assistive technology', () => {
    const { container } = render(<StatusDot variant="danger" label="Failed" />)

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('renders only the dot when no label is given', () => {
    const { container } = render(<StatusDot variant="info" aria-label="Syncing" />)

    expect(container.firstChild).toHaveAttribute('aria-label', 'Syncing')
    expect(screen.queryByText('Syncing')).not.toBeInTheDocument()
  })

  it('applies the variant color to the dot', () => {
    const { container } = render(<StatusDot variant="warning" label="Degraded" />)

    expect(container.querySelector('.teal-u-bg-warning')).toBeInTheDocument()
  })
})
