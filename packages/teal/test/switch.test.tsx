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

  it('keeps the checked switch on a primary track with an on-primary thumb', () => {
    render(<Switch aria-label="Security notifications" defaultChecked />)

    const root = screen.getByRole('switch', { name: 'Security notifications' })
    expect(root).toHaveAttribute('data-state', 'checked')
    expect(root).toHaveClass('data-[state=checked]:teal-u-bg-primary', 'data-[state=checked]:teal-u-border-primary')

    const thumb = root.querySelector('.teal-switch-thumb')
    expect(thumb).toHaveClass('data-[state=checked]:teal-u-bg-on-primary', 'data-[state=checked]:teal-u-size-5')
  })

  it('positions the thumb for both states at each size, including RTL', () => {
    render(
      <>
        <Switch aria-label="Medium" defaultChecked />
        <Switch aria-label="Small" size="sm" defaultChecked />
      </>,
    )

    // Thumb travel lives in styles.css (:dir-aware transforms) so the component
    // does not carry physical translate utilities.
    for (const name of ['Medium', 'Small']) {
      const thumb = screen.getByRole('switch', { name }).querySelector('.teal-switch-thumb')
      expect(thumb?.className).not.toContain('translate-x-')
    }
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

  it('layers a subtle hover state over the track for enabled switches only', () => {
    render(<Switch aria-label="Hoverable" />)

    const root = screen.getByRole('switch', { name: 'Hoverable' })
    expect(root).toHaveClass(
      'hover:enabled:teal-u-bg-[color:color-mix(in_srgb,var(--teal-color-on-surface)_8%,var(--teal-color-surface-container-highest))]',
    )
  })
})
