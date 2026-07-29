import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Rating } from '../src/Rating'

describe('Rating', () => {
  it('renders a radiogroup with one radio per star', () => {
    render(<Rating label="Rate this book" />)

    expect(screen.getByRole('radiogroup', { name: 'Rate this book' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('selects a rating on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Rating defaultValue={2} onChange={onChange} />)

    const fourth = screen.getByRole('radio', { name: '4 stars' })
    await user.click(fourth)

    expect(onChange).toHaveBeenCalledWith(4)
    expect(fourth).toHaveAttribute('aria-checked', 'true')
  })

  it('moves the rating and focus with arrow keys', async () => {
    const onChange = vi.fn()
    render(<Rating defaultValue={2} onChange={onChange} />)

    fireEvent.keyDown(screen.getByRole('radio', { name: '2 stars' }), { key: 'ArrowRight' })
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(3))
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('aria-checked', 'true')

    fireEvent.keyDown(screen.getByRole('radio', { name: '3 stars' }), { key: 'ArrowLeft' })
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(2))
  })

  it('clamps arrow-key movement at the bounds', () => {
    const onChange = vi.fn()
    render(<Rating defaultValue={5} onChange={onChange} />)

    fireEvent.keyDown(screen.getByRole('radio', { name: '5 stars' }), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('renders static stars with an accessible summary when readOnly', () => {
    render(<Rating readOnly value={3} />)

    expect(screen.getByRole('img', { name: '3 out of 5 stars' })).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('respects the max prop', () => {
    render(<Rating max={10} readOnly value={7} />)

    expect(screen.getByRole('img', { name: '7 out of 10 stars' })).toBeInTheDocument()
  })
})
