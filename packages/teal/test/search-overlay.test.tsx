import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchOverlay, type SearchOverlayRenderState } from '../src/SearchOverlay'

const pages = ['Getting started', 'Components', 'Foundations']

function renderResults({ activeIndex, listId, optionId, query }: SearchOverlayRenderState) {
  const visible = pages.filter((page) => page.toLowerCase().includes(query.toLowerCase()))
  return (
    <ul id={listId} role="listbox" aria-label="Results">
      {visible.map((page, index) => (
        <li key={page} id={optionId(index)} role="option" aria-selected={index === activeIndex}>
          {page}
        </li>
      ))}
    </ul>
  )
}

describe('SearchOverlay', () => {
  it('opens full-screen with a focused combobox input', () => {
    render(
      <SearchOverlay open onOpenChange={() => {}} resultCount={3} label="Site search">
        {renderResults}
      </SearchOverlay>,
    )

    expect(screen.getByRole('dialog', { name: 'Site search' })).toBeInTheDocument()
    const input = screen.getByRole('combobox', { name: 'Site search' })
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('-option-0'))
  })

  it('passes the query to the render prop and reports changes', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(
      <SearchOverlay open onOpenChange={() => {}} resultCount={2} onQueryChange={onQueryChange}>
        {renderResults}
      </SearchOverlay>,
    )

    await user.type(screen.getByRole('combobox'), 'comp')
    expect(onQueryChange).toHaveBeenLastCalledWith('comp')
    expect(screen.getByRole('option', { name: 'Components' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Foundations' })).not.toBeInTheDocument()
  })

  it('cycles the highlight with arrow keys and selects with Enter', () => {
    const onSelect = vi.fn()
    render(
      <SearchOverlay open onOpenChange={() => {}} resultCount={3} onSelect={onSelect}>
        {renderResults}
      </SearchOverlay>,
    )

    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('option', { name: 'Components' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('option', { name: 'Getting started' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(screen.getByRole('option', { name: 'Foundations' })).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('does not select when there are no results', () => {
    const onSelect = vi.fn()
    render(
      <SearchOverlay open onOpenChange={() => {}} resultCount={0} onSelect={onSelect}>
        {() => <p>No matches</p>}
      </SearchOverlay>,
    )

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })

  it('closes on Escape and via the close button', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SearchOverlay open onOpenChange={onOpenChange} resultCount={3}>
        {renderResults}
      </SearchOverlay>,
    )

    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
