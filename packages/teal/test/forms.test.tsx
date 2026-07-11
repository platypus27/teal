import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox, Field, Input, Select, Switch, TextArea } from '../src/index'

describe('Field', () => {
  it('connects its label, description, and error to the control', () => {
    render(
      <Field label="Email" description="Used for account alerts" error="Enter a valid email" required>
        <Input type="email" />
      </Field>,
    )

    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Used for account alerts Enter a valid email')
  })

  it('connects the same field contract to textareas', () => {
    render(
      <Field label="Notes">
        <TextArea />
      </Field>,
    )
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument()
  })
})

describe('Select', () => {
  it('supports accessible option selection through its value interface', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Field label="Role">
        <Select
          placeholder="Choose a role"
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'viewer', label: 'Viewer' },
          ]}
          onValueChange={onValueChange}
        />
      </Field>,
    )

    await user.click(screen.getByRole('combobox', { name: 'Role' }))
    await user.click(await screen.findByRole('option', { name: 'Viewer' }))
    expect(onValueChange).toHaveBeenCalledWith('viewer')
  })
})

describe('selection controls', () => {
  it('reports checkbox changes as booleans', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Include archived" onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox', { name: 'Include archived' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('renders the indeterminate glyph for uncontrolled checkboxes', () => {
    const { container } = render(
      <Checkbox label="Select all" defaultChecked="indeterminate" />,
    )

    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
      'data-state',
      'indeterminate',
    )
    expect(container.querySelector('.lucide-minus')).toBeInTheDocument()
  })

  it('supports an accessible switch label and description', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <Switch
        label="Notifications"
        description="Receive security alerts"
        onCheckedChange={onCheckedChange}
      />,
    )

    const control = screen.getByRole('switch', { name: 'Notifications' })
    expect(control).toHaveAccessibleDescription('Receive security alerts')
    await user.click(control)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
