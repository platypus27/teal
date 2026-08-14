import { fireEvent, render, screen } from '@testing-library/react'
import { BlockingOverlay } from '../src/BlockingOverlay'

describe('BlockingOverlay', () => {
  it('renders children without an overlay when hidden', () => {
    render(
      <BlockingOverlay>
        <p>Editable content</p>
      </BlockingOverlay>,
    )

    expect(screen.getByText('Editable content')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('marks the container as busy and shows the overlay when visible', () => {
    const { container } = render(
      <BlockingOverlay visible label="Saving changes">
        <p>Editable content</p>
      </BlockingOverlay>,
    )

    expect(container.firstChild).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status', { name: 'Saving changes' })).toBeInTheDocument()
    expect(screen.getByText('Saving changes')).toBeInTheDocument()
  })

  it('moves focus into the overlay while visible', () => {
    render(
      <BlockingOverlay visible label="Saving changes">
        <p>Editable content</p>
      </BlockingOverlay>,
    )

    expect(screen.getByRole('status', { name: 'Saving changes' })).toHaveFocus()
  })

  it('keeps Tab focus contained in the overlay', () => {
    render(
      <div>
        <button type="button">Outside</button>
        <BlockingOverlay visible label="Saving changes">
          <p>Editable content</p>
        </BlockingOverlay>
      </div>,
    )

    const overlay = screen.getByRole('status', { name: 'Saving changes' })
    fireEvent.keyDown(overlay, { key: 'Tab' })
    expect(overlay).toHaveFocus()
  })

  it('restores focus to the previously focused element when hidden', () => {
    const { rerender } = render(
      <div>
        <button type="button">Outside</button>
        <BlockingOverlay visible={false} label="Saving changes">
          <p>Editable content</p>
        </BlockingOverlay>
      </div>,
    )

    const outside = screen.getByRole('button', { name: 'Outside' })
    outside.focus()

    rerender(
      <div>
        <button type="button">Outside</button>
        <BlockingOverlay visible label="Saving changes">
          <p>Editable content</p>
        </BlockingOverlay>
      </div>,
    )
    expect(screen.getByRole('status', { name: 'Saving changes' })).toHaveFocus()

    rerender(
      <div>
        <button type="button">Outside</button>
        <BlockingOverlay visible={false} label="Saving changes">
          <p>Editable content</p>
        </BlockingOverlay>
      </div>,
    )
    expect(outside).toHaveFocus()
  })

  it('strengthens the scrim so the label stays legible over busy content', () => {
    render(
      <BlockingOverlay visible label="Saving changes">
        <p>Editable content</p>
      </BlockingOverlay>,
    )

    const overlay = screen.getByRole('status', { name: 'Saving changes' })
    expect(overlay.className).toContain('teal-u-bg-surface/80')
    expect(overlay.className).toContain('teal-u-backdrop-blur-sm')
    expect(overlay.className).not.toContain('teal-u-bg-surface/60')
  })
})
