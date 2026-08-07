import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpandableCard } from '../src/ExpandableCard'

describe('ExpandableCard', () => {
  it('renders collapsed with the extra content hidden from assistive technology', () => {
    render(<ExpandableCard title="Release notes">Full changelog</ExpandableCard>)

    expect(screen.getByRole('heading', { name: 'Release notes' })).toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: 'Show more' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    const region = document.getElementById(trigger.getAttribute('aria-controls') as string)
    expect(region).toHaveAttribute('aria-hidden', 'true')
    expect(region).toHaveTextContent('Full changelog')
  })

  it('expands and collapses when the trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<ExpandableCard title="Release notes">Full changelog</ExpandableCard>)

    const trigger = screen.getByRole('button', { name: 'Show more' })
    const region = document.getElementById(trigger.getAttribute('aria-controls') as string)

    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true')
    expect(region).toHaveAttribute('aria-hidden', 'false')

    await user.click(screen.getByRole('button', { name: 'Show less' }))
    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute('aria-expanded', 'false')
    expect(region).toHaveAttribute('aria-hidden', 'true')
  })

  it('starts expanded when defaultExpanded is set', () => {
    render(
      <ExpandableCard title="Release notes" defaultExpanded>
        Full changelog
      </ExpandableCard>,
    )

    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('respects the controlled expanded prop and reports changes', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <ExpandableCard title="Release notes" expanded={false} onExpandedChange={onExpandedChange}>
        Full changelog
      </ExpandableCard>,
    )

    await user.click(screen.getByRole('button', { name: 'Show more' }))
    expect(onExpandedChange).toHaveBeenCalledWith(true)
    // The parent owns the state, so the card stays collapsed.
    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('uses custom trigger labels', async () => {
    const user = userEvent.setup()
    render(
      <ExpandableCard title="Release notes" expandLabel="Read notes" collapseLabel="Close notes">
        Full changelog
      </ExpandableCard>,
    )

    await user.click(screen.getByRole('button', { name: 'Read notes' }))
    expect(screen.getByRole('button', { name: 'Close notes' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders without a title', () => {
    render(<ExpandableCard>Full changelog</ExpandableCard>)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument()
  })

  it('uses the requested heading element for the title', () => {
    render(
      <ExpandableCard title="Release notes" titleAs="h3">
        Full changelog
      </ExpandableCard>,
    )

    expect(screen.getByRole('heading', { level: 3, name: 'Release notes' })).toBeInTheDocument()
  })
})
