import { fireEvent, render, screen } from '@testing-library/react'
import { FocusTrap } from '../src/FocusTrap'

function Fixture({ active = true, restoreFocus = true }) {
  return (
    <div>
      <button type="button">outside</button>
      <FocusTrap active={active} restoreFocus={restoreFocus}>
        <button type="button">first</button>
        <button type="button">middle</button>
        <button type="button">last</button>
      </FocusTrap>
    </div>
  )
}

describe('FocusTrap', () => {
  it('moves focus to the first focusable element when activated', () => {
    render(<Fixture />)

    expect(screen.getByRole('button', { name: 'first' })).toHaveFocus()
  })

  it('wraps Tab from the last element back to the first', () => {
    render(<Fixture />)

    screen.getByRole('button', { name: 'last' }).focus()
    const prevented = !fireEvent.keyDown(screen.getByRole('button', { name: 'last' }), { key: 'Tab' })

    expect(prevented).toBe(true)
    expect(screen.getByRole('button', { name: 'first' })).toHaveFocus()
  })

  it('wraps Shift+Tab from the first element back to the last', () => {
    render(<Fixture />)

    screen.getByRole('button', { name: 'first' }).focus()
    fireEvent.keyDown(screen.getByRole('button', { name: 'first' }), { key: 'Tab', shiftKey: true })

    expect(screen.getByRole('button', { name: 'last' })).toHaveFocus()
  })

  it('does not trap Tab when inactive', () => {
    render(<Fixture active={false} />)

    const last = screen.getByRole('button', { name: 'last' })
    last.focus()
    const allowed = fireEvent.keyDown(last, { key: 'Tab' })

    expect(allowed).toBe(true)
    expect(last).toHaveFocus()
  })

  it('prevents Tab from escaping when there is nothing focusable inside', () => {
    render(
      <FocusTrap>
        <span>no controls here</span>
      </FocusTrap>,
    )

    const prevented = !fireEvent.keyDown(screen.getByText('no controls here'), { key: 'Tab' })
    expect(prevented).toBe(true)
  })

  it('restores focus to the previously focused element on deactivate', () => {
    const { rerender } = render(<Fixture active={false} />)

    screen.getByRole('button', { name: 'outside' }).focus()
    rerender(<Fixture active />)
    expect(screen.getByRole('button', { name: 'first' })).toHaveFocus()

    rerender(<Fixture active={false} />)
    expect(screen.getByRole('button', { name: 'outside' })).toHaveFocus()
  })

  it('restores focus to the element focused before activation on unmount', () => {
    const outside = document.createElement('button')
    outside.textContent = 'external'
    document.body.appendChild(outside)
    outside.focus()

    const { unmount } = render(
      <FocusTrap>
        <button type="button">trapped</button>
      </FocusTrap>,
    )

    expect(screen.getByRole('button', { name: 'trapped' })).toHaveFocus()
    unmount()
    expect(outside).toHaveFocus()
    outside.remove()
  })

  it('does not restore focus when restoreFocus is false', () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()

    const { unmount } = render(
      <FocusTrap restoreFocus={false}>
        <button type="button">trapped</button>
      </FocusTrap>,
    )

    unmount()
    expect(outside).not.toHaveFocus()
    outside.remove()
  })
})
