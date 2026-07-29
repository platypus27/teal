import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { List, ListItem } from '../src/List'

describe('List', () => {
  it('renders items with title and secondary text', () => {
    render(
      <List>
        <ListItem title="Avery Stone" secondary="Design lead" />
        <ListItem title="Blake Moreno" secondary="Platform team" />
      </List>,
    )

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Avery Stone')).toBeInTheDocument()
    expect(screen.getByText('Platform team')).toBeInTheDocument()
  })

  it('renders leading and trailing slots', () => {
    render(
      <List>
        <ListItem
          title="Invoices"
          leading={<span data-testid="leading" />}
          trailing={<span data-testid="trailing">$12</span>}
        />
      </List>,
    )

    expect(screen.getByTestId('leading')).toBeInTheDocument()
    expect(screen.getByTestId('trailing')).toBeInTheDocument()
  })

  it('renders plain items without button semantics', () => {
    render(
      <List>
        <ListItem title="Read only" />
      </List>,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders interactive items as buttons and calls onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <List>
        <ListItem title="Open settings" onClick={onClick} />
      </List>,
    )

    await user.click(screen.getByRole('button', { name: 'Open settings' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies dense padding to items in a dense list', () => {
    render(
      <List dense>
        <ListItem title="Compact row" />
      </List>,
    )

    expect(screen.getByText('Compact row').closest('div')).toHaveClass('teal-u-py-1.5')
  })

  it('uses regular padding by default', () => {
    render(
      <List>
        <ListItem title="Regular row" />
      </List>,
    )

    expect(screen.getByText('Regular row').closest('div')).toHaveClass('teal-u-py-3')
  })
})
