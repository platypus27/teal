import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionBar } from '../src/ActionBar'

describe('ActionBar', () => {
  it('renders a labelled region containing the actions', () => {
    render(
      <ActionBar label="Edit actions">
        <button>Save</button>
        <button>Cancel</button>
      </ActionBar>,
    )

    const region = screen.getByRole('region', { name: 'Edit actions' })
    expect(region).toBeInTheDocument()
    expect(region).toContainElement(screen.getByRole('button', { name: 'Save' }))
    expect(region).toContainElement(screen.getByRole('button', { name: 'Cancel' }))
  })

  it('uses a default accessible name', () => {
    render(<ActionBar>content</ActionBar>)

    expect(screen.getByRole('region', { name: 'Actions' })).toBeInTheDocument()
  })

  it('applies a bottom border treatment by default and flips it for position="top"', () => {
    const { rerender } = render(<ActionBar>content</ActionBar>)

    expect(screen.getByRole('region').className).toContain('teal-u-border-t')

    rerender(<ActionBar position="top">content</ActionBar>)
    expect(screen.getByRole('region').className).toContain('teal-u-border-b')
  })

  it('sticks to the configured edge when sticky', () => {
    render(
      <ActionBar sticky position="bottom">
        content
      </ActionBar>,
    )

    const region = screen.getByRole('region')
    expect(region.className).toContain('teal-u-sticky')
    expect(region.className).toContain('teal-u-bottom-0')
  })

  it('rounds the bottom corners when position="bottom"', () => {
    const { rerender } = render(<ActionBar position="bottom">content</ActionBar>)

    expect(screen.getByRole('region').className).toContain('teal-u-rounded-b-2xl')

    rerender(<ActionBar position="top">content</ActionBar>)
    expect(screen.getByRole('region').className).not.toContain('teal-u-rounded-b-2xl')
  })

  it('forwards clicks on child actions', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(
      <ActionBar>
        <button onClick={onSave}>Save</button>
      </ActionBar>,
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onSave).toHaveBeenCalledOnce()
  })
})
