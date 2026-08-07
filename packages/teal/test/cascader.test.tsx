import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Cascader } from '../src/Cascader'

const options = [
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
    ],
  },
  {
    value: 'design',
    label: 'Design',
    children: [{ value: 'visual', label: 'Visual' }],
  },
  { value: 'ops', label: 'Operations' },
]

describe('Cascader', () => {
  it('renders a combobox with the label and placeholder', () => {
    render(<Cascader label="Team" placeholder="Pick a team" options={options} />)

    const control = screen.getByRole('combobox', { name: 'Team' })
    expect(control).toHaveTextContent('Pick a team')
    expect(control).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens columns on click and commits the path when a leaf is chosen', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Cascader label="Team" options={options} onValueChange={onValueChange} />)

    const control = screen.getByRole('combobox', { name: 'Team' })
    await user.click(control)
    // The first option is active on open, so its children column is already visible.
    expect((await screen.findAllByRole('listbox'))).toHaveLength(2)
    expect(screen.getAllByRole('option')).toHaveLength(5)

    await user.click(screen.getByRole('option', { name: 'Design' }))
    expect(screen.getAllByRole('listbox')).toHaveLength(2)
    expect(screen.getByRole('option', { name: 'Visual' })).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Visual' }))
    expect(onValueChange).toHaveBeenCalledWith(['design', 'visual'])
    expect(control).toHaveTextContent('Design / Visual')
    expect(control).toHaveAttribute('aria-expanded', 'false')
  })

  it('selects a root-level leaf in one step', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Cascader label="Team" options={options} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('combobox', { name: 'Team' }))
    await user.click(await screen.findByRole('option', { name: 'Operations' }))

    expect(onValueChange).toHaveBeenCalledWith(['ops'])
  })

  it('navigates columns with the keyboard and selects with Enter', async () => {
    const onValueChange = vi.fn()
    render(<Cascader label="Team" options={options} onValueChange={onValueChange} />)
    const control = screen.getByRole('combobox', { name: 'Team' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const engineering = await screen.findByRole('option', { name: 'Engineering' })
    await waitFor(() => expect(engineering).toHaveFocus())

    fireEvent.keyDown(engineering, { key: 'ArrowDown' })
    await waitFor(() => expect(screen.getByRole('option', { name: 'Design' })).toHaveFocus())

    fireEvent.keyDown(screen.getByRole('option', { name: 'Design' }), { key: 'ArrowRight' })
    const visual = screen.getByRole('option', { name: 'Visual' })
    await waitFor(() => expect(visual).toHaveFocus())

    fireEvent.keyDown(visual, { key: 'Enter' })
    expect(onValueChange).toHaveBeenCalledWith(['design', 'visual'])
    expect(control).toHaveFocus()
  })

  it('moves back to the parent column with ArrowLeft', async () => {
    render(<Cascader label="Team" options={options} defaultValue={['engineering', 'backend']} />)
    const control = screen.getByRole('combobox', { name: 'Team' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const backend = await screen.findByRole('option', { name: 'Backend' })
    await waitFor(() => expect(backend).toHaveFocus())
    expect(backend).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(backend, { key: 'ArrowLeft' })
    await waitFor(() => expect(screen.getByRole('option', { name: 'Engineering' })).toHaveFocus())
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    render(<Cascader label="Team" options={options} />)
    const control = screen.getByRole('combobox', { name: 'Team' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const engineering = await screen.findByRole('option', { name: 'Engineering' })
    fireEvent.keyDown(engineering, { key: 'Escape' })

    expect(control).toHaveAttribute('aria-expanded', 'false')
    expect(control).toHaveFocus()
  })

  it('respects the controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Cascader label="Team" options={options} value={['design', 'visual']} onValueChange={onValueChange} />)

    const control = screen.getByRole('combobox', { name: 'Team' })
    expect(control).toHaveTextContent('Design / Visual')

    await user.click(control)
    await user.click(await screen.findByRole('option', { name: 'Operations' }))

    expect(onValueChange).toHaveBeenCalledWith(['ops'])
    expect(control).toHaveTextContent('Design / Visual')
  })
})
