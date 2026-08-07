import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormErrorSummary } from '../src/FormErrorSummary'

describe('FormErrorSummary', () => {
  it('renders an alert listing one link per error', () => {
    render(
      <FormErrorSummary
        errors={[
          { fieldId: 'email', label: 'Email', message: 'Enter a valid email address.' },
          { fieldId: 'password', label: 'Password', message: 'Use at least 12 characters.' },
        ]}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('There is a problem')
    expect(screen.getByRole('link', { name: 'Email: Enter a valid email address.' })).toHaveAttribute('href', '#email')
    expect(screen.getByRole('link', { name: 'Password: Use at least 12 characters.' })).toHaveAttribute('href', '#password')
  })

  it('focuses the offending field when a link is clicked', async () => {
    const user = userEvent.setup()
    const onErrorClick = vi.fn()
    render(
      <div>
        <FormErrorSummary
          errors={[{ fieldId: 'email', label: 'Email', message: 'Enter a valid email address.' }]}
          onErrorClick={onErrorClick}
        />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </div>,
    )

    await user.click(screen.getByRole('link', { name: 'Email: Enter a valid email address.' }))

    expect(document.getElementById('email')).toHaveFocus()
    expect(onErrorClick).toHaveBeenCalledWith({ fieldId: 'email', label: 'Email', message: 'Enter a valid email address.' })
  })

  it('makes a non-focusable target focusable before focusing it', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <FormErrorSummary errors={[{ fieldId: 'region', message: 'Pick at least one region.' }]} />
        <div id="region">Region checkboxes</div>
      </div>,
    )

    await user.click(screen.getByRole('link', { name: 'Pick at least one region.' }))

    const target = document.getElementById('region')
    expect(target).toHaveAttribute('tabindex', '-1')
    expect(target).toHaveFocus()
  })

  it('renders a custom title', () => {
    render(<FormErrorSummary title="2 errors in this form" errors={[{ fieldId: 'email', message: 'Required.' }]} />)

    expect(screen.getByRole('alert')).toHaveTextContent('2 errors in this form')
  })

  it('renders nothing when there are no errors', () => {
    const { container } = render(<FormErrorSummary errors={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
