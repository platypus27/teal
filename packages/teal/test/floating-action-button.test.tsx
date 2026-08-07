import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pencil } from 'lucide-react'
import { FloatingActionButton } from '../src/FloatingActionButton'

describe('FloatingActionButton', () => {
  it('renders a button with an accessible label and a default plus icon', () => {
    render(<FloatingActionButton label="Create item" />)

    expect(screen.getByRole('button', { name: 'Create item' })).toBeInTheDocument()
  })

  it('is fixed to the requested corner', () => {
    render(<FloatingActionButton label="Create item" position="top-left" />)

    const button = screen.getByRole('button', { name: 'Create item' })
    expect(button.className).toContain('teal-u-fixed')
    expect(button.className).toContain('teal-u-top-6')
    expect(button.className).toContain('teal-u-left-6')
  })

  it('shows the extended label text when provided', () => {
    render(<FloatingActionButton label="Create item" extendedLabel="Create" />)

    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('renders a custom icon', () => {
    render(<FloatingActionButton label="Edit" icon={<Pencil data-testid="pencil" />} />)

    expect(screen.getByTestId('pencil')).toBeInTheDocument()
  })

  it('shows a tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<FloatingActionButton label="Create item" tooltip="Add a new item" />)

    await user.hover(screen.getByRole('button', { name: 'Create item' }))
    expect(await screen.findByRole('tooltip', { name: 'Add a new item' })).toBeInTheDocument()
  })

  it('forwards onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<FloatingActionButton label="Create item" onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Create item' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
