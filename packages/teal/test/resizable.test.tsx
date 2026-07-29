import { fireEvent, render, screen } from '@testing-library/react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../src/Resizable'

if (typeof window.PointerEvent === 'undefined') {
  // jsdom does not implement PointerEvent; MouseEvent carries the fields we need.
  window.PointerEvent = window.MouseEvent as unknown as typeof PointerEvent
}

function renderGroup(props?: { direction?: 'horizontal' | 'vertical' }) {
  return render(
    <ResizablePanelGroup data-testid="group" {...props}>
      <ResizablePanel defaultSize={30} data-testid="panel-a">
        <span>Sidebar</span>
      </ResizablePanel>
      <ResizableHandle data-testid="handle" />
      <ResizablePanel data-testid="panel-b">
        <span>Content</span>
      </ResizablePanel>
    </ResizablePanelGroup>,
  )
}

function flexBasis(element: HTMLElement) {
  return Number.parseFloat(element.style.flexBasis)
}

describe('Resizable', () => {
  it('lays out panels with their initial percentage sizes', () => {
    renderGroup()

    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(30)
    expect(flexBasis(screen.getByTestId('panel-b'))).toBeCloseTo(70)
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders the handle as a separator with the preceding panel size', () => {
    renderGroup()

    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-orientation', 'vertical')
    expect(handle).toHaveAttribute('aria-valuenow', '30')
    expect(handle).toHaveAttribute('aria-valuemin', '0')
    expect(handle).toHaveAttribute('aria-valuemax', '100')
    expect(handle.className).toContain('teal-u-touch-none')
  })

  it('uses a horizontal separator orientation for vertical groups', () => {
    renderGroup({ direction: 'vertical' })
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('resizes with arrow keys in both directions', () => {
    renderGroup()
    const handle = screen.getByRole('separator')

    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(handle).toHaveAttribute('aria-valuenow', '35')
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(35)
    expect(flexBasis(screen.getByTestId('panel-b'))).toBeCloseTo(65)

    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    expect(handle).toHaveAttribute('aria-valuenow', '30')
  })

  it('clamps resizing to the panel min and max sizes', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50} minSize={40} maxSize={60} data-testid="panel-a" />
        <ResizableHandle data-testid="handle" />
        <ResizablePanel data-testid="panel-b" />
      </ResizablePanelGroup>,
    )
    const handle = screen.getByRole('separator')

    for (let i = 0; i < 5; i += 1) fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(60)

    for (let i = 0; i < 10; i += 1) fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(40)
  })

  it('resets to the default sizes on double-click', () => {
    renderGroup()
    const handle = screen.getByRole('separator')

    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(35)

    fireEvent.doubleClick(handle)
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(30)
    expect(handle).toHaveAttribute('aria-valuenow', '30')
  })

  it('resizes on pointer drag using the container size', () => {
    renderGroup()
    const group = screen.getByTestId('group')
    const handle = screen.getByRole('separator')
    group.getBoundingClientRect = () =>
      ({ width: 1000, height: 400, top: 0, left: 0, right: 1000, bottom: 400, x: 0, y: 0 }) as DOMRect

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 300, button: 0 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 400 })
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(40)
    expect(flexBasis(screen.getByTestId('panel-b'))).toBeCloseTo(60)

    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 400 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 500 })
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(40)
  })

  it('ignores keyboard and pointer input when the handle is disabled', () => {
    render(
      <ResizablePanelGroup>
        <ResizablePanel defaultSize={50} data-testid="panel-a" />
        <ResizableHandle disabled />
        <ResizablePanel data-testid="panel-b" />
      </ResizablePanelGroup>,
    )
    const handle = screen.getByRole('separator')

    expect(handle).toHaveAttribute('aria-disabled', 'true')
    expect(handle).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(flexBasis(screen.getByTestId('panel-a'))).toBeCloseTo(50)
  })
})
