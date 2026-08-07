import { render, screen } from '@testing-library/react'
import { Portal } from '../src/Portal'

describe('Portal', () => {
  it('renders children into document.body by default', () => {
    render(
      <div data-testid="host">
        <Portal>
          <p>Portalled content</p>
        </Portal>
      </div>,
    )

    const content = screen.getByText('Portalled content')
    expect(content.parentElement).toBe(document.body)
    expect(screen.getByTestId('host')).not.toContainElement(content)
  })

  it('renders children into a custom container', () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    render(
      <Portal container={container}>
        <p>Contained content</p>
      </Portal>,
    )

    expect(container).toContainElement(screen.getByText('Contained content'))
    container.remove()
  })

  it('removes the portalled content on unmount', () => {
    const { unmount } = render(
      <Portal>
        <p>Temporary content</p>
      </Portal>,
    )

    expect(screen.getByText('Temporary content')).toBeInTheDocument()
    unmount()
    expect(screen.queryByText('Temporary content')).not.toBeInTheDocument()
  })
})
