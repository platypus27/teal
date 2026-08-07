import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, useFormFieldError } from '../src/Form'

function FieldError({ name }: { name: string }) {
  const error = useFormFieldError(name)
  return error ? <p role="alert">{error}</p> : null
}

describe('Form', () => {
  it('renders a form element around its children', () => {
    render(
      <Form aria-label="Profile">
        <input name="displayName" defaultValue="Avery" />
      </Form>,
    )

    expect(screen.getByRole('form', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Avery')).toBeInTheDocument()
  })

  it('passes collected field values to onSubmit and prevents navigation', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <Form onSubmit={onSubmit}>
        <input name="email" defaultValue="avery@example.com" />
        <select name="plan" defaultValue="pro">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
        <button type="submit">Save</button>
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      { email: 'avery@example.com', plan: 'pro' },
      expect.objectContaining({ type: 'submit' }),
    )
  })

  it('collects repeated names as an array of values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <Form onSubmit={onSubmit}>
        <input type="checkbox" name="tag" value="design" defaultChecked />
        <input type="checkbox" name="tag" value="research" defaultChecked />
        <button type="submit">Save</button>
      </Form>,
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith({ tag: ['design', 'research'] }, expect.anything())
  })

  it('exposes the error map to descendants through context', () => {
    render(
      <Form errors={{ email: 'Enter a work email' }}>
        <FieldError name="email" />
      </Form>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a work email')
  })

  it('returns no error for unknown names or outside a Form', () => {
    render(
      <>
        <Form errors={{ email: 'Enter a work email' }}>
          <FieldError name="password" />
        </Form>
        <FieldError name="email" />
      </>,
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
