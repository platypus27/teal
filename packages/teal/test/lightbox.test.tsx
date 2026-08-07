import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Lightbox } from '../src/Lightbox'

const images = [
  { src: '/a.jpg', alt: 'First photo' },
  { src: '/b.jpg', alt: 'Second photo' },
  { src: '/c.jpg', alt: 'Third photo', caption: 'Sunset over the bay' },
]

describe('Lightbox', () => {
  it('opens as a dialog showing the current image and counter', () => {
    render(<Lightbox open onOpenChange={() => {}} images={images} label="Vacation photos" />)

    expect(screen.getByRole('dialog', { name: 'Vacation photos' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'First photo' })).toBeInTheDocument()
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('advances with the next button and wraps at the end', async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    render(<Lightbox open onOpenChange={() => {}} images={images} onIndexChange={onIndexChange} />)

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Second photo' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(onIndexChange).toHaveBeenLastCalledWith(0)
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('moves between images with arrow keys', () => {
    const onIndexChange = vi.fn()
    render(<Lightbox open onOpenChange={() => {}} images={images} onIndexChange={onIndexChange} />)

    fireEvent.keyDown(screen.getByRole('dialog').firstChild as Element, { key: 'ArrowRight' })
    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(screen.getByRole('img', { name: 'Second photo' })).toBeInTheDocument()

    fireEvent.keyDown(screen.getByRole('dialog').firstChild as Element, { key: 'ArrowLeft' })
    expect(onIndexChange).toHaveBeenCalledWith(0)
  })

  it('wraps backwards from the first image', () => {
    const onIndexChange = vi.fn()
    render(<Lightbox open onOpenChange={() => {}} images={images} onIndexChange={onIndexChange} />)

    fireEvent.keyDown(screen.getByRole('dialog').firstChild as Element, { key: 'ArrowLeft' })
    expect(onIndexChange).toHaveBeenCalledWith(2)
    expect(screen.getByText('3 of 3')).toBeInTheDocument()
  })

  it('respects the controlled index', async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    render(<Lightbox open onOpenChange={() => {}} images={images} index={2} onIndexChange={onIndexChange} />)

    expect(screen.getByRole('img', { name: 'Third photo' })).toBeInTheDocument()
    expect(screen.getByText('3 of 3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next image' }))
    expect(onIndexChange).toHaveBeenCalledWith(0)
    expect(screen.getByText('3 of 3')).toBeInTheDocument()
  })

  it('closes on Escape and via the close button', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(<Lightbox open onOpenChange={onOpenChange} images={images} />)

    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)

    rerender(<Lightbox open onOpenChange={onOpenChange} images={images} />)
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Lightbox open onOpenChange={onOpenChange} images={images} />)

    const overlay = document.querySelector('.teal-dialog-overlay') as Element
    await user.click(overlay)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('starts at defaultIndex and renders the caption', () => {
    render(<Lightbox open onOpenChange={() => {}} images={images} defaultIndex={2} />)

    expect(screen.getByRole('img', { name: 'Third photo' })).toBeInTheDocument()
    expect(screen.getByText('Sunset over the bay')).toBeInTheDocument()
    expect(screen.getByText('3 of 3')).toBeInTheDocument()
  })

  it('hides navigation controls for a single image', () => {
    render(<Lightbox open onOpenChange={() => {}} images={images.slice(0, 1)} />)

    expect(screen.queryByRole('button', { name: 'Next image' })).not.toBeInTheDocument()
    expect(screen.queryByText('1 of 1')).not.toBeInTheDocument()
  })
})
