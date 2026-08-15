import { fireEvent, render, screen } from '@testing-library/react'
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

describe('Combobox toggle close (fix 1.3)', () => {
  const options = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
  ]

  it('closes the listbox when the input is clicked while open', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Role" options={options} />)
    const input = screen.getByRole('combobox', { name: 'Role' })

    await user.click(input)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    await screen.findByRole('listbox')

    await user.click(input)
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('still opens and filters when typing after a toggle close', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Role" options={options} />)
    const input = screen.getByRole('combobox', { name: 'Role' })

    await user.click(input)
    await user.click(input) // closed
    await user.type(input, 'edi')

    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findAllByRole('option')).toHaveLength(1)
  })
})

describe('Combobox multiple', () => {
  const options = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ]

  it('opens a multi-selectable listbox and toggles options without closing', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Combobox label="Roles" multiple options={options} onValueChange={onValueChange} />)
    const control = screen.getByRole('combobox', { name: 'Roles' })

    await user.click(control)
    const listbox = await screen.findByRole('listbox')
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true')

    await user.click(screen.getByRole('option', { name: 'Editor' }))
    expect(onValueChange).toHaveBeenCalledWith(['editor'])
    await user.click(screen.getByRole('option', { name: 'Viewer' }))
    expect(onValueChange).toHaveBeenCalledWith(['editor', 'viewer'])
    expect(control).toHaveAttribute('aria-expanded', 'true') // stays open
  })

  it('removes a selected value via its chip remove button', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Combobox label="Roles" multiple value={['editor', 'viewer']} options={options} onValueChange={onValueChange} />)

    const remove = screen.getByRole('button', { name: 'Remove Editor' })
    expect(remove).toHaveClass('teal-u-size-6')
    await user.click(remove)
    expect(onValueChange).toHaveBeenCalledWith(['viewer'])
  })

  it('filters options from the popover input and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Roles" multiple options={options} />)
    const control = screen.getByRole('combobox', { name: 'Roles' })
    await user.click(control)

    await user.type(await screen.findByLabelText('Filter options'), 'view')
    expect(screen.getAllByRole('option')).toHaveLength(1)

    fireEvent.keyDown(screen.getByLabelText('Filter options'), { key: 'Escape' })
    expect(control).toHaveAttribute('aria-expanded', 'false')
  })
})
