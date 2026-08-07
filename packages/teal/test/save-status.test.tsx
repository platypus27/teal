import { render, screen } from '@testing-library/react'
import { SaveStatus } from '../src/SaveStatus'

describe('SaveStatus', () => {
  it('shows the saved state by default', () => {
    render(<SaveStatus />)

    expect(screen.getByRole('status')).toHaveTextContent('Saved')
  })

  it('shows the saving state', () => {
    render(<SaveStatus status="saving" />)

    expect(screen.getByRole('status')).toHaveTextContent('Saving…')
  })

  it('shows the error state', () => {
    render(<SaveStatus status="error" />)

    expect(screen.getByRole('status')).toHaveTextContent('Save failed')
  })

  it('renders a relative timestamp for a recent save', () => {
    render(<SaveStatus savedAt={new Date(Date.now() - 5 * 60 * 1000)} />)

    expect(screen.getByRole('status')).toHaveTextContent('Saved · 5 min ago')
  })

  it('shows "just now" for a fresh save', () => {
    render(<SaveStatus savedAt={new Date()} />)

    expect(screen.getByRole('status')).toHaveTextContent('Saved · just now')
  })

  it('supports a custom timestamp formatter', () => {
    const savedAt = new Date('2026-01-01T10:00:00Z')
    render(<SaveStatus savedAt={savedAt} formatSavedAt={(date) => date.toISOString()} />)

    expect(screen.getByRole('status')).toHaveTextContent('Saved · 2026-01-01T10:00:00.000Z')
  })

  it('only shows the timestamp in the saved state', () => {
    render(<SaveStatus status="saving" savedAt={new Date()} />)

    expect(screen.getByRole('status')).not.toHaveTextContent('just now')
  })
})
