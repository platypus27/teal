import { render, screen } from '@testing-library/react'
import { VisuallyHidden } from '../src/VisuallyHidden'

describe('VisuallyHidden', () => {
  it('renders children in the accessibility tree', () => {
    render(
      <button type="button">
        <VisuallyHidden>Open menu</VisuallyHidden>
      </button>,
    )

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('hides content visually with clipping styles', () => {
    render(<VisuallyHidden>Secret label</VisuallyHidden>)

    const element = screen.getByText('Secret label')
    expect(element.style.position).toBe('absolute')
    expect(element.style.overflow).toBe('hidden')
  })
})
