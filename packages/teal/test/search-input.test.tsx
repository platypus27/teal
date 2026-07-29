import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../src/SearchInput'

describe('SearchInput', () => {
  it('associates its label and description with the input', () => {
    render(<SearchInput label="Search projects" description="Matches project names" placeholder="Type to filter" />)

    const input = screen.getByRole('textbox', { name: 'Search projects' })
    expect(input).toHaveAttribute('placeholder', 'Type to filter')
    expect(input).toHaveAccessibleDescription('Matches project names')
  })

  it('reports typed text through onValueChange', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SearchInput label="Search projects" onValueChange={onValueChange} />)

    await user.type(screen.getByRole('textbox', { name: 'Search projects' }), 'ab')
    expect(onValueChange).toHaveBeenLastCalledWith('ab')
    expect(screen.getByRole('textbox', { name: 'Search projects' })).toHaveValue('ab')
  })

  it('shows a clear button for non-empty values and clears on click', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const onValueChange = vi.fn()
    render(
      <SearchInput label="Search projects" defaultValue="roadmap" onClear={onClear} onValueChange={onValueChange} />,
    )

    const clear = screen.getByRole('button', { name: 'Clear search' })
    await user.click(clear)
    expect(onClear).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenLastCalledWith('')
    expect(screen.getByRole('textbox', { name: 'Search projects' })).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('hides the clear button while loading', () => {
    render(<SearchInput label="Search projects" value="roadmap" loading onValueChange={() => undefined} />)

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('does not show a clear button when empty or disabled', () => {
    const { rerender } = render(<SearchInput label="Search projects" />)
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()

    rerender(<SearchInput label="Search projects" value="roadmap" disabled onValueChange={() => undefined} />)
    expect(screen.getByRole('textbox', { name: 'Search projects' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('passes through invalid state', () => {
    render(<SearchInput label="Search projects" aria-invalid="true" />)

    expect(screen.getByRole('textbox', { name: 'Search projects' })).toHaveAttribute('aria-invalid', 'true')
  })
})
