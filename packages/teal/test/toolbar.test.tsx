import { render, screen } from '@testing-library/react'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../src/Toolbar'

describe('Toolbar', () => {
  it('renders children inside a toolbar role', () => {
    render(
      <Toolbar aria-label="Editor actions">
        <button type="button">Save</button>
      </Toolbar>,
    )

    const toolbar = screen.getByRole('toolbar', { name: 'Editor actions' })
    expect(toolbar).toContainElement(screen.getByRole('button', { name: 'Save' }))
  })

  it('renders groups with a group role', () => {
    render(
      <Toolbar>
        <ToolbarGroup>
          <button type="button">Bold</button>
        </ToolbarGroup>
      </Toolbar>,
    )

    expect(screen.getByRole('group')).toContainElement(screen.getByRole('button', { name: 'Bold' }))
  })

  it('renders a presentational separator', () => {
    const { container } = render(
      <Toolbar>
        <ToolbarGroup>
          <button type="button">Undo</button>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <button type="button">Redo</button>
        </ToolbarGroup>
      </Toolbar>,
    )

    const separator = container.querySelector('[aria-hidden="true"]')
    expect(separator).not.toBeNull()
    expect(separator?.className).toContain('teal-u-w-px')
    expect(separator?.className).toContain('teal-u-bg-outline-variant/60')
  })

  it('merges a caller className onto the root', () => {
    render(<Toolbar aria-label="Custom" className="teal-u-mt-4" />)
    expect(screen.getByRole('toolbar', { name: 'Custom' }).className).toContain('teal-u-mt-4')
  })
})
