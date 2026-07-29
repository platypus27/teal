import { render, screen } from '@testing-library/react'
import { Kbd } from '../src/Kbd'

describe('Kbd', () => {
  it('renders its children as a kbd element', () => {
    const { container } = render(<Kbd>⌘K</Kbd>)

    const kbd = container.querySelector('kbd')
    expect(kbd).toBeInTheDocument()
    expect(kbd).toHaveTextContent('⌘K')
  })

  it('merges caller classes', () => {
    const { container } = render(<Kbd className="custom-class">Esc</Kbd>)

    expect(container.querySelector('kbd')).toHaveClass('custom-class')
  })

  it('supports rendering inside prose', () => {
    render(
      <p>
        Press <Kbd>Ctrl</Kbd> to continue
      </p>,
    )

    expect(screen.getByText('Ctrl')).toBeInTheDocument()
  })
})
