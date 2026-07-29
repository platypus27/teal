import { render, screen } from '@testing-library/react'
import { AvatarGroup } from '../src/AvatarGroup'

const team = ['Avery Chen', 'Morgan Diaz', 'Priya Nair', 'Sam Okafor', 'June Park', 'Lee Ramos']

describe('AvatarGroup', () => {
  it('renders up to max avatars plus an overflow bubble', () => {
    render(<AvatarGroup names={team} />)

    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('lists every name in the group aria-label, including hidden ones', () => {
    render(<AvatarGroup names={team} />)

    expect(screen.getByRole('group', { name: team.join(', ') })).toBeInTheDocument()
  })

  it('renders all avatars without overflow when names fit within max', () => {
    render(<AvatarGroup names={team.slice(0, 3)} />)

    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })

  it('respects a custom max', () => {
    render(<AvatarGroup names={team} max={2} />)

    expect(screen.getAllByRole('img')).toHaveLength(2)
    expect(screen.getByText('+4')).toBeInTheDocument()
  })

  it('applies sm sizing to avatars and the overflow bubble', () => {
    render(<AvatarGroup names={team} max={1} size="sm" />)

    expect(screen.getAllByRole('img')[0]?.className).toContain('teal-u-size-8')
    expect(screen.getByText('+5').className).toContain('teal-u-size-8')
  })
})
