import { render, screen } from '@testing-library/react'
import { Field } from '../src/Field'
import { Fieldset } from '../src/Fieldset'
import { Input } from '../src/Input'

describe('Fieldset', () => {
  it('renders a group named by its legend', () => {
    render(
      <Fieldset legend="Shipping address">
        <input aria-label="Street" />
      </Fieldset>,
    )

    expect(screen.getByRole('group', { name: 'Shipping address' })).toBeInTheDocument()
  })

  it('links the description to the group', () => {
    render(
      <Fieldset legend="Notifications" description="Choose how we reach you">
        <input aria-label="Email digest" />
      </Fieldset>,
    )

    const group = screen.getByRole('group', { name: 'Notifications' })
    const description = screen.getByText('Choose how we reach you')
    expect(group).toHaveAttribute('aria-describedby', description.id)
  })

  it('omits aria-describedby when no description is given', () => {
    render(<Fieldset legend="Plain group">content</Fieldset>)

    expect(screen.getByRole('group', { name: 'Plain group' })).not.toHaveAttribute('aria-describedby')
  })

  it('composes with Field, keeping labels and errors intact', () => {
    render(
      <Fieldset legend="Account">
        <Field label="Display name" error="Required" required>
          <Input defaultValue="Avery" />
        </Field>
      </Fieldset>,
    )

    const input = screen.getByRole('textbox', { name: /Display name/ })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('passes the disabled attribute through to the fieldset', () => {
    render(
      <Fieldset legend="Locked" disabled>
        <input aria-label="Street" />
      </Fieldset>,
    )

    expect(screen.getByRole('group', { name: 'Locked' })).toBeDisabled()
  })
})
