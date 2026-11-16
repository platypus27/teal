import { render, screen } from '@testing-library/react'
import { Switch } from '../src/index'

describe('Switch', () => {
  it('renders an unchecked switch that reads as off in every theme', () => {
    render(<Switch aria-label="Weekly digest" />)

    const root = screen.getByRole('switch', { name: 'Weekly digest' })
    expect(root).toHaveAttribute('data-state', 'unchecked')
    expect(root).toHaveClass('teal-u-bg-surface-container-highest', 'teal-u-border-outline')
    expect(root).not.toHaveClass(
      'teal-u-bg-[color:light-dark(var(--teal-color-surface),var(--teal-color-primary-container))]',
    )

    const thumb = root.querySelector('.teal-switch-thumb')
    expect(thumb).not.toBeNull()
    expect(thumb).toHaveClass('teal-u-bg-outline', 'teal-u-size-4')
    expect(thumb).not.toHaveClass('teal-u-bg-white')
  })

  it('keeps the checked switch on a primary track with a white thumb', () => {
    render(<Switch aria-label="Security notifications" defaultChecked />)

    const root = screen.getByRole('switch', { name: 'Security notifications' })
    expect(root).toHaveAttribute('data-state', 'checked')
    expect(root).toHaveClass('data-[state=checked]:teal-u-bg-primary', 'data-[state=checked]:teal-u-border-primary')

    const thumb = root.querySelector('.teal-switch-thumb')
    expect(thumb).toHaveClass('data-[state=checked]:teal-u-bg-white', 'data-[state=checked]:teal-u-size-5')
  })

  it('positions the thumb for both states at each size', () => {
    render(
      <>
        <Switch aria-label="Medium" defaultChecked />
        <Switch aria-label="Small" size="sm" defaultChecked />
      </>,
    )

    const medium = screen.getByRole('switch', { name: 'Medium' }).querySelector('.teal-switch-thumb')
    expect(medium).toHaveClass('teal-u-translate-x-0.5', 'data-[state=checked]:teal-u-translate-x-[26px]')

    const small = screen.getByRole('switch', { name: 'Small' }).querySelector('.teal-switch-thumb')
    expect(small).toHaveClass('teal-u-translate-x-0.5', 'data-[state=checked]:teal-u-translate-x-[18px]')
  })

  it('centers the thumb vertically inside the track', () => {
    render(<Switch aria-label="Alignment" />)

    expect(screen.getByRole('switch', { name: 'Alignment' })).toHaveClass('teal-u-flex', 'teal-u-items-center')
  })

  it('marks disabled switches with a not-allowed cursor and dimmed state', () => {
    render(<Switch aria-label="Billing alerts" disabled />)

    const root = screen.getByRole('switch', { name: 'Billing alerts' })
    expect(root).toBeDisabled()
    expect(root).toHaveClass('disabled:teal-u-cursor-not-allowed')
  })
})
