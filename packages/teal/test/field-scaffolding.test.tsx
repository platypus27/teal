import { render, screen } from '@testing-library/react'
import { FieldScaffolding } from '../src/field-scaffolding'

describe('FieldScaffolding', () => {
  it('renders the label wired to the control id and the description with its id', () => {
    render(
      <FieldScaffolding controlId="field-1" description="Help text" descriptionId="field-1-desc" label="Name">
        <input id="field-1" />
      </FieldScaffolding>,
    )

    expect(screen.getByText('Name')).toHaveAttribute('for', 'field-1')
    expect(screen.getByText('Help text')).toHaveAttribute('id', 'field-1-desc')
  })

  it('omits the label when a surrounding Field provides it', () => {
    render(
      <FieldScaffolding controlId="field-1" label="Name" labeledByField>
        <input id="field-1" />
      </FieldScaffolding>,
    )

    expect(screen.queryByText('Name')).not.toBeInTheDocument()
  })

  it('omits label and description when they are not given', () => {
    const { container } = render(
      <FieldScaffolding controlId="field-1">
        <input id="field-1" />
      </FieldScaffolding>,
    )

    expect(container.querySelector('label')).toBeNull()
    expect(container.querySelector('p')).toBeNull()
  })
})
