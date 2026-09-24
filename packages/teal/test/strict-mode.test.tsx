import { StrictMode, act } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from '../src/Combobox'
import { DatePicker } from '../src/DatePicker'
import { Dialog } from '../src/Dialog'
import { RichTextEditor } from '../src/RichTextEditor'
import { Toaster, toast, dismissToast } from '../src/Toast'
import { TreeSelect } from '../src/TreeSelect'

/**
 * StrictMode double-invokes effects in development, which is exactly the
 * failure mode of the deferred-focus and external-store patterns used by the
 * interactive components. Every test here renders inside StrictMode and then
 * asserts behavior that breaks when effects run twice: focus landing on the
 * wrong node, values applying twice, or duplicated entries.
 */
function renderStrict(ui: React.ReactElement) {
  return render(<StrictMode>{ui}</StrictMode>)
}

describe('StrictMode conformance', () => {
  const treeOptions = [
    {
      value: 'engineering',
      label: 'Engineering',
      children: [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
      ],
    },
    { value: 'design', label: 'Design' },
  ]

  it('keeps TreeSelect deferred focus and selection correct across double effects', async () => {
    const onValueChange = vi.fn()
    renderStrict(<TreeSelect label="Department" options={treeOptions} onValueChange={onValueChange} />)
    const control = screen.getByRole('combobox', { name: 'Department' })

    fireEvent.keyDown(control, { key: 'ArrowDown' })
    const engineering = (await screen.findByRole('treeitem', { name: 'Engineering' })).querySelector('button') as HTMLElement
    await waitFor(() => expect(engineering).toHaveFocus())

    fireEvent.keyDown(engineering, { key: 'ArrowRight' })
    fireEvent.keyDown(engineering, { key: 'ArrowRight' })
    const frontend = screen.getByRole('button', { name: 'Frontend' })
    await waitFor(() => expect(frontend).toHaveFocus())

    fireEvent.keyDown(frontend, { key: 'Enter' })
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('frontend')
    expect(control).toHaveFocus()
  })

  it('applies RichTextEditor keyboard shortcuts exactly once', () => {
    const onChange = vi.fn()
    renderStrict(<RichTextEditor label="Body" defaultValue="hello" onChange={onChange} />)
    const textarea = screen.getByRole('textbox', { name: 'Body' }) as HTMLTextAreaElement

    textarea.setSelectionRange(0, 5)
    fireEvent.keyDown(textarea, { key: 'b', ctrlKey: true })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('**hello**')
    expect(textarea.value).toBe('**hello**')
  })

  it('renders each toast once and dismisses it cleanly', () => {
    renderStrict(<Toaster />)
    let id = ''
    act(() => {
      id = toast({ title: 'Saved just once' })
    })

    expect(screen.getAllByText('Saved just once')).toHaveLength(1)

    act(() => {
      dismissToast(id)
    })
    expect(screen.queryByText('Saved just once')).not.toBeInTheDocument()
  })

  it('opens the DatePicker grid, keeps deferred focus working, and commits once', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderStrict(<DatePicker label="Due date" defaultValue={new Date(2024, 0, 15)} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('textbox', { name: 'Due date' }))
    await screen.findByText('January 2024')

    await user.click(screen.getByRole('button', { name: '16' }))
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 0, 16))
  })

  it('keeps Combobox keyboard selection single-fire', async () => {
    const onValueChange = vi.fn()
    const options = [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ]
    renderStrict(<Combobox label="Project role" options={options} onValueChange={onValueChange} />)
    const input = screen.getByRole('combobox', { name: 'Project role' })

    await userEvent.setup().click(input)
    await screen.findAllByRole('option')
    await userEvent.setup().keyboard('{ArrowDown}{Enter}')

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('editor')
  })

  it('keeps Dialog open state and escape handling stable', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderStrict(
      <Dialog open onOpenChange={onOpenChange} title="Strict dialog">
        Body content
      </Dialog>,
    )

    expect(screen.getByRole('dialog', { name: 'Strict dialog' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
