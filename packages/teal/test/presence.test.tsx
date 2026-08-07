import { fireEvent, render, screen } from '@testing-library/react'
import { Presence } from '../src/Presence'

describe('Presence', () => {
  it('renders children with data-state open when present', () => {
    render(
      <Presence present>
        <p>appearing content</p>
      </Presence>,
    )

    const region = screen.getByText('appearing content').parentElement as HTMLElement
    expect(region).toHaveAttribute('data-state', 'open')
  })

  it('renders nothing when not present and never opened', () => {
    render(
      <Presence present={false}>
        <p>appearing content</p>
      </Presence>,
    )

    expect(screen.queryByText('appearing content')).not.toBeInTheDocument()
  })

  it('unmounts immediately after closing when there is no transition', () => {
    const onExitComplete = vi.fn()
    const { rerender } = render(
      <Presence present onExitComplete={onExitComplete}>
        <p>appearing content</p>
      </Presence>,
    )

    rerender(
      <Presence present={false} onExitComplete={onExitComplete}>
        <p>appearing content</p>
      </Presence>,
    )

    expect(screen.queryByText('appearing content')).not.toBeInTheDocument()
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })

  it('stays mounted through the exit transition and exposes data-state closed', () => {
    const onExitComplete = vi.fn()
    const { rerender } = render(
      <Presence present onExitComplete={onExitComplete} style={{ transitionDuration: '0.2s' }}>
        <p>appearing content</p>
      </Presence>,
    )

    rerender(
      <Presence present={false} onExitComplete={onExitComplete} style={{ transitionDuration: '0.2s' }}>
        <p>appearing content</p>
      </Presence>,
    )

    // Still mounted while the exit transition runs.
    const region = screen.getByText('appearing content').parentElement as HTMLElement
    expect(region).toHaveAttribute('data-state', 'closed')
    expect(onExitComplete).not.toHaveBeenCalled()

    fireEvent.transitionEnd(region)

    expect(screen.queryByText('appearing content')).not.toBeInTheDocument()
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })

  it('remounts when present flips back to true', () => {
    const { rerender } = render(
      <Presence present={false}>
        <p>appearing content</p>
      </Presence>,
    )

    rerender(
      <Presence present>
        <p>appearing content</p>
      </Presence>,
    )

    const region = screen.getByText('appearing content').parentElement as HTMLElement
    expect(region).toHaveAttribute('data-state', 'open')
  })
})
