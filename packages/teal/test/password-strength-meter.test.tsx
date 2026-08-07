import { render, screen } from '@testing-library/react'
import { defaultPasswordScore, PasswordStrengthMeter } from '../src/PasswordStrengthMeter'

describe('PasswordStrengthMeter', () => {
  it('renders a progressbar with an accessible name', () => {
    render(<PasswordStrengthMeter password="" />)

    const meter = screen.getByRole('progressbar', { name: 'Password strength' })
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '4')
  })

  it('reports an empty password as very weak', () => {
    render(<PasswordStrengthMeter password="" />)

    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '0')
    expect(meter).toHaveAttribute('aria-valuetext', 'Very weak')
    expect(screen.getByText('Very weak')).toBeInTheDocument()
  })

  it('scores a long, varied password as very strong with the default heuristic', () => {
    render(<PasswordStrengthMeter password="Abcdefgh1!23" />)

    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '4')
    expect(meter).toHaveAttribute('aria-valuetext', 'Very strong')
  })

  it('uses a caller-supplied score function', () => {
    const score = vi.fn().mockReturnValue(2)
    render(<PasswordStrengthMeter password="whatever" score={score} />)

    expect(score).toHaveBeenCalledWith('whatever')
    const meter = screen.getByRole('progressbar')
    expect(meter).toHaveAttribute('aria-valuenow', '2')
    expect(meter).toHaveAttribute('aria-valuetext', 'Fair')
  })

  it('clamps out-of-range scores', () => {
    render(<PasswordStrengthMeter password="x" score={() => 42} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4')
  })

  it('hides the visible strength text when showLabel is false', () => {
    render(<PasswordStrengthMeter password="Abcdefgh1!23" showLabel={false} />)

    expect(screen.queryByText('Very strong')).not.toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Very strong')
  })

  it('defaultPasswordScore rewards length and variety', () => {
    expect(defaultPasswordScore('')).toBe(0)
    expect(defaultPasswordScore('abc')).toBe(0)
    expect(defaultPasswordScore('abcdefgh')).toBe(1)
    expect(defaultPasswordScore('Abcdefg1')).toBe(3)
    expect(defaultPasswordScore('Abcdefgh1!23')).toBe(4)
  })
})
