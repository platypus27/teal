import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Folder, Mail, Music, Settings } from 'lucide-react'
import { Dock, DockItem } from '../src/Dock'

describe('Dock', () => {
  it('renders a navigation landmark with named icon buttons', () => {
    render(
      <Dock>
        <DockItem active icon={<Mail />} label="Mail" />
        <DockItem icon={<Music />} label="Music" />
        <DockItem icon={<Folder />} label="Files" />
      </Dock>,
    )

    expect(screen.getByRole('navigation', { name: 'Dock' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mail' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Music' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Files' })).toBeInTheDocument()
  })

  it('marks the active item', () => {
    render(
      <Dock>
        <DockItem active icon={<Mail />} label="Mail" />
        <DockItem icon={<Music />} label="Music" />
      </Dock>,
    )

    expect(screen.getByRole('button', { name: 'Mail' })).toHaveAttribute('data-active')
    expect(screen.getByRole('button', { name: 'Music' })).not.toHaveAttribute('data-active')
  })

  it('calls onClick when an item is activated', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Dock>
        <DockItem icon={<Settings />} label="Settings" onClick={onClick} />
      </Dock>,
    )

    await user.click(screen.getByRole('button', { name: 'Settings' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports a custom accessible name and disabled items', () => {
    render(
      <Dock aria-label="Apps">
        <DockItem disabled icon={<Folder />} label="Files" />
      </Dock>,
    )

    expect(screen.getByRole('navigation', { name: 'Apps' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Files' })).toBeDisabled()
  })
})
