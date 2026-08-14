import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleGroup, ToggleGroupItem } from '../src/ToggleGroup'

describe('ToggleGroup', () => {
  it('toggles a single checked item at a time in single mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" defaultValue="left" onValueChange={onValueChange} aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    )

    expect(screen.getByRole('radio', { name: 'Left' })).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('radio', { name: 'Center' }))

    expect(onValueChange).toHaveBeenCalledWith('center')
    expect(screen.getByRole('radio', { name: 'Center' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Left' })).toHaveAttribute('aria-checked', 'false')
  })

  it('keeps several items pressed in multiple mode', async () => {
    const user = userEvent.setup()
    render(
      <ToggleGroup type="multiple" defaultValue={['bold']} aria-label="Formatting">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    )

    await user.click(screen.getByRole('button', { name: 'Italic' }))

    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('moves focus with arrow keys and keeps a single tab stop', async () => {
    const user = userEvent.setup()
    render(
      <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    )

    const left = screen.getByRole('radio', { name: 'Left' })
    left.focus()
    // The focused item becomes the group's only tab stop.
    await waitFor(() => expect(left).toHaveAttribute('tabIndex', '0'))
    expect(screen.getByRole('radio', { name: 'Center' })).toHaveAttribute('tabIndex', '-1')

    fireEvent.keyDown(left, { key: 'ArrowRight' })

    const center = screen.getByRole('radio', { name: 'Center' })
    await waitFor(() => expect(center).toHaveFocus())
    // Arrows move focus only; selection still requires an explicit activation.
    expect(center).toHaveAttribute('aria-checked', 'false')

    await user.keyboard(' ')
    expect(center).toHaveAttribute('aria-checked', 'true')
    expect(left).toHaveAttribute('aria-checked', 'false')
  })

  it('does not toggle a disabled item', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" onValueChange={onValueChange} aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center" disabled>
          Center
        </ToggleGroupItem>
      </ToggleGroup>,
    )

    await user.click(screen.getByRole('radio', { name: 'Center' }))

    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole('radio', { name: 'Center' })).toHaveAttribute('aria-checked', 'false')
  })

  it('supports a controlled value in single mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" value="left" onValueChange={onValueChange} aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    )

    await user.click(screen.getByRole('radio', { name: 'Right' }))

    expect(onValueChange).toHaveBeenCalledWith('right')
    expect(screen.getByRole('radio', { name: 'Right' })).toHaveAttribute('aria-checked', 'false')
  })
})

describe('ToggleGroup segmented variant', () => {
  const options = [
    { value: 'list', label: 'List' },
    { value: 'board', label: 'Board' },
    { value: 'timeline', label: 'Timeline', disabled: true },
  ]

  it('renders the options as a labelled radiogroup', () => {
    render(<ToggleGroup type="single" variant="segmented" aria-label="Project view" options={options} />)

    expect(screen.getByRole('radiogroup', { name: 'Project view' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'Timeline' })).toBeDisabled()
  })

  it('selects the first enabled option by default and renders the sliding pill', () => {
    const { container } = render(
      <ToggleGroup type="single" variant="segmented" aria-label="Project view" options={options} />,
    )

    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('data-state', 'on')
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('moves the selection on click', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" variant="segmented" aria-label="Project view" options={options} onValueChange={onValueChange} />,
    )

    await user.click(screen.getByRole('radio', { name: 'Board' }))

    expect(onValueChange).toHaveBeenCalledWith('board')
    expect(screen.getByRole('radio', { name: 'Board' })).toHaveAttribute('data-state', 'on')
  })

  it('honors a controlled value', () => {
    render(
      <ToggleGroup type="single" variant="segmented" aria-label="Project view" options={options} value="board" />,
    )

    expect(screen.getByRole('radio', { name: 'Board' })).toHaveAttribute('data-state', 'on')
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('data-state', 'off')
  })
})
