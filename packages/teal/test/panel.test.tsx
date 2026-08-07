import { render, screen } from '@testing-library/react'
import { Panel } from '../src/Panel'

describe('Panel', () => {
  it('renders children without a header when no title is given', () => {
    render(<Panel>Body copy</Panel>)

    expect(screen.getByText('Body copy')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('renders the title as a heading', () => {
    render(<Panel title="Usage summary">Body copy</Panel>)

    expect(screen.getByRole('heading', { name: 'Usage summary' })).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
  })

  it('renders actions next to the title', () => {
    render(
      <Panel title="Members" actions={<button type="button">Invite</button>}>
        Body copy
      </Panel>,
    )

    expect(screen.getByRole('heading', { name: 'Members' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument()
  })

  it('renders the header when only actions are provided', () => {
    render(<Panel actions={<button type="button">Edit</button>}>Body copy</Panel>)

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('uses the requested heading element for the title', () => {
    render(
      <Panel title="Deep section" titleAs="h4">
        Body copy
      </Panel>,
    )

    expect(screen.getByRole('heading', { level: 4, name: 'Deep section' })).toBeInTheDocument()
  })

  it('merges a custom className onto the surface', () => {
    render(
      <Panel data-testid="panel" className="custom-class">
        Body copy
      </Panel>,
    )

    expect(screen.getByTestId('panel')).toHaveClass('custom-class')
    expect(screen.getByTestId('panel')).toHaveClass('teal-u-border')
  })

  it('forwards the ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Panel ref={ref}>Body copy</Panel>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
