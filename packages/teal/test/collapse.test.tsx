import { render, screen } from '@testing-library/react'
import { Collapse } from '../src/Collapse'

function regionOf(text: string): HTMLElement {
  // p > inner min-height wrapper > Collapse region
  return (screen.getByText(text).parentElement as HTMLElement).parentElement as HTMLElement
}

describe('Collapse', () => {
  it('renders closed by default with hidden, inert content', () => {
    render(
      <Collapse>
        <p>collapsible body</p>
      </Collapse>,
    )

    const region = regionOf('collapsible body')
    expect(region).toHaveAttribute('data-state', 'closed')
    expect(region).toHaveAttribute('aria-hidden', 'true')
    expect(region).toHaveAttribute('inert')
  })

  it('exposes content when open', () => {
    render(
      <Collapse open>
        <p>collapsible body</p>
      </Collapse>,
    )

    const region = regionOf('collapsible body')
    expect(region).toHaveAttribute('data-state', 'open')
    expect(region).toHaveAttribute('aria-hidden', 'false')
    expect(region).not.toHaveAttribute('inert')
  })

  it('toggles between open and closed states', () => {
    const { rerender } = render(
      <Collapse open={false}>
        <p>collapsible body</p>
      </Collapse>,
    )

    const region = regionOf('collapsible body')
    expect(region).toHaveAttribute('data-state', 'closed')

    rerender(
      <Collapse open>
        <p>collapsible body</p>
      </Collapse>,
    )
    expect(region).toHaveAttribute('data-state', 'open')
    expect(region).not.toHaveAttribute('inert')
  })

  it('forwards extra props to the region', () => {
    render(
      <Collapse open aria-label="More details">
        <p>collapsible body</p>
      </Collapse>,
    )

    expect(screen.getByLabelText('More details')).toBeInTheDocument()
  })
})
