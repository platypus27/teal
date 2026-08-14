import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreeSelect } from '../src/TreeSelect'

const options = [
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
    ],
  },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
]

describe('TreeSelect', () => {
  it('renders a combobox with the label and placeholder', () => {
    render(<TreeSelect label="Department" placeholder="Pick a department" options={options} />)

    const control = screen.getByRole('combobox', { name: 'Department' })
    expect(control).toHaveTextContent('Pick a department')
    expect(control).toHaveAttribute('aria-expanded', 'false')
    expect(control).toHaveAttribute('aria-haspopup', 'tree')
  })

  it('expands a branch on click and selects a leaf', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TreeSelect label="Department" options={options} onValueChange={onValueChange} />)

    const control = screen.getByRole('combobox', { name: 'Department' })
    await user.click(control)
    expect(await screen.findByRole('tree')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Frontend' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Engineering' }))
    expect(control).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Engineering' }).closest('li')).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'Frontend' }))
    expect(onValueChange).toHaveBeenCalledWith('frontend')
    expect(control).toHaveTextContent('Frontend')
    expect(control).toHaveAttribute('aria-expanded', 'false')
  })

  it('navigates the tree with arrow keys and selects with Enter', async () => {
    const onValueChange = vi.fn()
    render(<TreeSelect label="Department" options={options} onValueChange={onValueChange} />)
    const control = screen.getByRole('combobox', { name: 'Department' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const engineering = await screen.findByRole('treeitem', { name: 'Engineering' })
    await waitFor(() => expect(engineering.querySelector('button')).toHaveFocus())

    fireEvent.keyDown(engineering.querySelector('button') as HTMLElement, { key: 'ArrowRight' })
    expect(engineering).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(engineering.querySelector('button') as HTMLElement, { key: 'ArrowRight' })
    const frontend = screen.getByRole('treeitem', { name: 'Frontend' }).querySelector('button') as HTMLElement
    await waitFor(() => expect(frontend).toHaveFocus())

    fireEvent.keyDown(frontend, { key: 'Enter' })
    expect(onValueChange).toHaveBeenCalledWith('frontend')
    expect(control).toHaveFocus()
  })

  it('collapses an expanded branch with ArrowLeft', async () => {
    render(<TreeSelect label="Department" options={options} defaultExpandedValues={['engineering']} />)
    const control = screen.getByRole('combobox', { name: 'Department' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const engineering = await screen.findByRole('button', { name: 'Engineering' })
    expect(engineering.closest('li')).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(engineering, { key: 'ArrowLeft' })
    expect(engineering.closest('li')).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: 'Frontend' })).not.toBeInTheDocument()
  })

  it('moves focus with typeahead', async () => {
    render(<TreeSelect label="Department" options={options} />)
    const control = screen.getByRole('combobox', { name: 'Department' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const engineering = await screen.findByRole('treeitem', { name: 'Engineering' })
    const button = engineering.querySelector('button') as HTMLElement
    await waitFor(() => expect(button).toHaveFocus())

    fireEvent.keyDown(button, { key: 'm' })
    const marketing = screen.getByRole('treeitem', { name: 'Marketing' }).querySelector('button') as HTMLElement
    await waitFor(() => expect(marketing).toHaveFocus())
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    render(<TreeSelect label="Department" options={options} />)
    const control = screen.getByRole('combobox', { name: 'Department' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const engineering = await screen.findByRole('treeitem', { name: 'Engineering' })
    fireEvent.keyDown(engineering.querySelector('button') as HTMLElement, { key: 'Escape' })

    expect(control).toHaveAttribute('aria-expanded', 'false')
    expect(control).toHaveFocus()
  })

  it('reveals and highlights the controlled value on open', async () => {
    const user = userEvent.setup()
    render(<TreeSelect label="Department" options={options} value="backend" onValueChange={() => undefined} />)

    const control = screen.getByRole('combobox', { name: 'Department' })
    expect(control).toHaveTextContent('Backend')

    await user.click(control)
    const backend = await screen.findByRole('treeitem', { name: 'Backend' })
    expect(backend).toHaveAttribute('aria-selected', 'true')
  })
})

describe('TreeSelect columns display', () => {
  const options = [
    {
      value: 'engineering',
      label: 'Engineering',
      children: [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
      ],
    },
    { value: 'ops', label: 'Operations' },
  ]

  it('opens columns on click and commits the full path when a leaf is chosen', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TreeSelect label="Team" display="columns" options={options} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('combobox', { name: 'Team' }))

    expect(await screen.findAllByRole('listbox')).toHaveLength(1)
    await user.click(screen.getByRole('option', { name: /Engineering/ }))
    expect(await screen.findAllByRole('listbox')).toHaveLength(2)

    await user.click(screen.getByRole('option', { name: 'Backend' }))
    expect(onValueChange).toHaveBeenCalledWith(['engineering', 'backend'])
    expect(screen.getByRole('combobox', { name: 'Team' })).toHaveTextContent('Engineering / Backend')
  })

  it('selects a root-level leaf in one step', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TreeSelect label="Team" display="columns" options={options} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('combobox', { name: 'Team' }))

    await user.click(await screen.findByRole('option', { name: 'Operations' }))

    expect(onValueChange).toHaveBeenCalledWith(['ops'])
  })

  it('moves back to the parent column with ArrowLeft and shows the controlled path', async () => {
    const user = userEvent.setup()
    render(<TreeSelect label="Team" display="columns" options={options} value={['engineering', 'backend']} />)
    const control = screen.getByRole('combobox', { name: 'Team' })
    await user.click(control)

    const backend = await screen.findByRole('option', { name: 'Backend' })
    expect(backend).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(backend, { key: 'ArrowLeft' })
    expect(screen.getByRole('option', { name: /Engineering/ })).toHaveFocus()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<TreeSelect label="Team" display="columns" options={options} />)
    const control = screen.getByRole('combobox', { name: 'Team' })
    await user.click(control)
    await screen.findAllByRole('listbox')

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })

    expect(control).toHaveAttribute('aria-expanded', 'false')
    expect(control).toHaveFocus()
  })
})
