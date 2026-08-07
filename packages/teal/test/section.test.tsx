import { render, screen } from '@testing-library/react'
import { Section } from '../src/Section'

describe('Section', () => {
  it('renders a section element with medium rhythm spacing by default', () => {
    render(<Section data-testid="section">Content</Section>)

    const section = screen.getByTestId('section')
    expect(section.tagName).toBe('SECTION')
    expect(section.className).toContain('teal-u-py-12')
    expect(section).toHaveTextContent('Content')
  })

  it('switches the vertical spacing', () => {
    render(<Section data-testid="section" spacing="lg" />)
    expect(screen.getByTestId('section').className).toContain('teal-u-py-20')
  })

  it('can drop the rhythm spacing entirely', () => {
    render(<Section data-testid="section" spacing="none" />)
    const section = screen.getByTestId('section')
    expect(section.className).not.toContain('teal-u-py-12')
    expect(section.className).not.toContain('teal-u-py-20')
  })

  it('wraps children in a centered container when container is set', () => {
    render(
      <Section data-testid="section" container containerSize="sm">
        <p>Inner</p>
      </Section>,
    )

    const inner = screen.getByText('Inner').parentElement as HTMLElement
    expect(inner.className).toContain('teal-u-mx-auto')
    expect(inner.className).toContain('teal-u-max-w-2xl')
  })

  it('leaves children unwrapped by default', () => {
    render(
      <Section data-testid="section">
        <p>Inner</p>
      </Section>,
    )

    expect(screen.getByText('Inner').parentElement).toBe(screen.getByTestId('section'))
  })

  it('merges a caller className', () => {
    render(<Section data-testid="section" className="teal-u-bg-surface-container" />)
    expect(screen.getByTestId('section').className).toContain('teal-u-bg-surface-container')
  })
})
