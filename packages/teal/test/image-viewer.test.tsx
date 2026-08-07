import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageViewer } from '../src/ImageViewer'

describe('ImageViewer', () => {
  it('renders the image in a labelled region at 100% zoom', () => {
    render(<ImageViewer src="/photo.jpg" alt="Studio photo" label="Studio viewer" />)

    expect(screen.getByRole('region', { name: 'Studio viewer' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Studio photo' })).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('zooms in and out with the toolbar buttons', async () => {
    const user = userEvent.setup()
    const onZoomChange = vi.fn()
    render(<ImageViewer src="/photo.jpg" alt="Photo" onZoomChange={onZoomChange} />)

    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(onZoomChange).toHaveBeenCalledWith(1.5)
    expect(screen.getByText('150%')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Zoom out' }))
    expect(onZoomChange).toHaveBeenCalledWith(1)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('resets the zoom with the reset button', async () => {
    const user = userEvent.setup()
    const onZoomChange = vi.fn()
    render(<ImageViewer src="/photo.jpg" alt="Photo" defaultZoom={2} onZoomChange={onZoomChange} />)

    expect(screen.getByText('200%')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset zoom' }))
    expect(onZoomChange).toHaveBeenCalledWith(1)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('zooms with the + and - keys', () => {
    const onZoomChange = vi.fn()
    render(<ImageViewer src="/photo.jpg" alt="Photo" onZoomChange={onZoomChange} />)

    const viewport = screen.getByRole('img', { name: 'Photo' })
    fireEvent.keyDown(viewport, { key: '+' })
    expect(onZoomChange).toHaveBeenCalledWith(1.5)
    fireEvent.keyDown(viewport, { key: '-' })
    expect(onZoomChange).toHaveBeenCalledWith(1)
  })

  it('clamps zoom at the configured bounds', () => {
    const onZoomChange = vi.fn()
    render(<ImageViewer src="/photo.jpg" alt="Photo" maxZoom={2} zoomStep={1} onZoomChange={onZoomChange} />)

    fireEvent.keyDown(screen.getByRole('img', { name: 'Photo' }), { key: '+' })
    fireEvent.keyDown(screen.getByRole('img', { name: 'Photo' }), { key: '+' })
    fireEvent.keyDown(screen.getByRole('img', { name: 'Photo' }), { key: '+' })
    expect(onZoomChange).toHaveBeenLastCalledWith(2)
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled()
  })

  it('respects the controlled zoom', async () => {
    const user = userEvent.setup()
    const onZoomChange = vi.fn()
    render(<ImageViewer src="/photo.jpg" alt="Photo" zoom={2} onZoomChange={onZoomChange} />)

    expect(screen.getByText('200%')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zoom out' }))
    expect(onZoomChange).toHaveBeenCalledWith(1.5)
    expect(screen.getByText('200%')).toBeInTheDocument()
  })

  it('pans the image with a pointer drag while zoomed', () => {
    render(<ImageViewer src="/photo.jpg" alt="Photo" defaultZoom={2} />)

    const image = screen.getByRole('img', { name: 'Photo' })
    fireEvent.pointerDown(image, { pointerId: 1, clientX: 100, clientY: 100, button: 0 })
    fireEvent.pointerMove(image, { pointerId: 1, clientX: 140, clientY: 120 })
    fireEvent.pointerUp(image, { pointerId: 1 })

    expect(image).toHaveStyle({ transform: 'translate(40px, 20px) scale(2)' })
  })

  it('ignores pointer drags at the minimum zoom', () => {
    render(<ImageViewer src="/photo.jpg" alt="Photo" />)

    const image = screen.getByRole('img', { name: 'Photo' })
    fireEvent.pointerDown(image, { pointerId: 1, clientX: 100, clientY: 100, button: 0 })
    fireEvent.pointerMove(image, { pointerId: 1, clientX: 140, clientY: 120 })
    fireEvent.pointerUp(image, { pointerId: 1 })

    expect(image).toHaveStyle({ transform: 'translate(0px, 0px) scale(1)' })
  })
})
