import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from '../src/Combobox'

const options = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

describe('Combobox', () => {
  it('renders the input with its label and placeholder', () => {
    render(<Combobox label="Project role" placeholder="Pick a role" options={options} />)
    const input = screen.getByRole('combobox', { name: 'Project role' })
    expect(input).toHaveAttribute('placeholder', 'Pick a role')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the listbox on focus and filters options as the user types', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Project role" options={options} />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    await user.click(input)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findAllByRole('option')).toHaveLength(3)

    await user.type(input, 'edi')
    const visible = screen.getAllByRole('option')
    expect(visible).toHaveLength(1)
    expect(visible[0]).toHaveTextContent('Editor')
  })

  it('filters case-insensitively', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Project role" options={options} />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    await user.type(input, 'ADMIN')
    const visible = screen.getAllByRole('option')
    expect(visible).toHaveLength(1)
    expect(visible[0]).toHaveTextContent('Administrator')
  })

  it('selects an option by clicking and reports its value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Combobox label="Project role" options={options} onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    await user.click(input)
    await user.click(await screen.findByRole('option', { name: 'Viewer' }))

    expect(onValueChange).toHaveBeenCalledWith('viewer')
    expect(input).toHaveValue('Viewer')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports keyboard highlight and selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Combobox label="Project role" options={options} onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    await user.click(input)
    await screen.findAllByRole('option')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onValueChange).toHaveBeenCalledWith('editor')
    expect(input).toHaveValue('Editor')
  })

  it('closes on Escape without changing the value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Combobox label="Project role" options={options} onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    await user.click(input)
    await screen.findAllByRole('option')
    await user.keyboard('{Escape}')

    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Project role" options={options} emptyMessage="Nothing here" />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    await user.type(input, 'zzz')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(await screen.findByText('Nothing here')).toBeInTheDocument()
  })

  it('marks the selected option with aria-selected', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Project role" options={options} defaultValue="editor" />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    expect(input).toHaveValue('Editor')
    await user.click(input)
    expect(await screen.findByRole('option', { name: 'Editor' })).toHaveAttribute('aria-selected', 'true')
  })
})
