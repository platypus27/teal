import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EcosystemShell } from '../src/EcosystemShell'

const home = { href: 'https://home.example', label: 'Home' }
const destinations = [
  { id: 'yang', href: 'https://yang.example', label: 'Yang', status: 'degraded' as const },
  { id: 'photos', href: 'https://photos.example', label: 'Photos', current: true },
]

function renderShell(props: Partial<Parameters<typeof EcosystemShell>[0]> = {}) {
  return render(
    <EcosystemShell home={home} destinations={destinations} {...props}>
      <p>Main content</p>
    </EcosystemShell>,
  )
}

describe('EcosystemShell', () => {
  it('renders the rail with Home first, caller-supplied destinations, and honest health status', () => {
    renderShell({ brand: <span>Kryv mark</span> })

    const navigation = screen.getByRole('navigation', { name: 'Kryv ecosystem' })
    expect(within(navigation).getByText('Kryv mark')).toBeInTheDocument()
    const links = within(navigation).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      expect.stringContaining('Home'),
      expect.stringContaining('Yang'),
      expect.stringContaining('Photos'),
    ])
    expect(screen.getByRole('link', { name: 'Photos' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Degraded')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Yang' })).toHaveAttribute('href', 'https://yang.example')
  })

  it('renders children in the main region and an optional top bar', () => {
    renderShell({ topBar: <div>Photos top bar</div> })

    expect(screen.getByRole('main')).toHaveTextContent('Main content')
    expect(screen.getByText('Photos top bar')).toBeInTheDocument()
  })

  it('composes a settings link and account menu footer from user and settingsHref', async () => {
    const user = userEvent.setup()
    const signOut = vi.fn()
    renderShell({
      settingsHref: 'https://home.example/settings',
      settingsCurrent: true,
      user: { name: 'Avery', email: 'avery@example.com' },
      appSignOut: { label: 'Sign out of Photos', onSelect: signOut },
      ssoSignOut: { label: 'Sign out everywhere', onSelect: vi.fn() },
    })

    const settings = screen.getByRole('link', { name: 'Settings' })
    expect(settings).toHaveAttribute('href', 'https://home.example/settings')
    expect(settings).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Avery' }))
    const appSignOut = await screen.findByRole('menuitem', { name: 'Sign out of Photos' })
    expect(screen.getByRole('menuitem', { name: 'Sign out everywhere' })).toBeInTheDocument()
    await user.click(appSignOut)
    expect(signOut).toHaveBeenCalled()
  })

  it('lets a footer prop replace the composed footer', () => {
    renderShell({
      settingsHref: 'https://home.example/settings',
      user: { name: 'Avery' },
      footer: <button type="button">Custom footer</button>,
    })

    expect(screen.getByRole('button', { name: 'Custom footer' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Avery' })).not.toBeInTheDocument()
  })

  it('reports navigation with the destination id', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    renderShell({ onNavigate })

    await user.click(screen.getByRole('link', { name: 'Yang' }))
    expect(onNavigate).toHaveBeenCalledWith('yang')
  })

  it('opens a mobile drawer with the full rail and closes it on navigation', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    renderShell({ onNavigate })

    expect(screen.getAllByRole('navigation', { name: 'Kryv ecosystem' })).toHaveLength(1)
    const trigger = screen.getByRole('button', { name: 'Open ecosystem navigation' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const drawer = await screen.findByRole('dialog', { name: 'Kryv ecosystem' })
    const drawerLinks = within(drawer).getAllByRole('link')
    expect(drawerLinks.map((link) => link.textContent)).toEqual([
      expect.stringContaining('Home'),
      expect.stringContaining('Yang'),
      expect.stringContaining('Photos'),
    ])

    await user.click(within(drawer).getByRole('link', { name: 'Yang' }))
    expect(onNavigate).toHaveBeenCalledWith('yang')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders no rail footer when neither footer, settingsHref, nor user is given', () => {
    renderShell()

    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('renders the default EcosystemBrand when no brand prop is passed', () => {
    renderShell()

    const navigation = screen.getByRole('navigation', { name: 'Kryv ecosystem' })
    const mark = within(navigation).getByRole('img', { name: 'Kryv' })
    expect(mark).toHaveClass('ecosystem-brand__mark')
    expect(mark.getAttribute('src')).toMatch(/^data:image\/png;base64,/)
    expect(navigation.querySelector('.ecosystem-brand__reveal .ecosystem-brand__wordmark')).toBeInTheDocument()
  })

  it('lets an explicit brand prop replace the default EcosystemBrand', () => {
    renderShell({ brand: <span>Kryv mark</span> })

    const navigation = screen.getByRole('navigation', { name: 'Kryv ecosystem' })
    expect(within(navigation).getByText('Kryv mark')).toBeInTheDocument()
    expect(within(navigation).queryByRole('img', { name: 'Kryv' })).not.toBeInTheDocument()
  })

  it('resolves rail icons through catalogIcon by default', () => {
    renderShell({
      destinations: [
        { id: 'photos', href: 'https://photos.example', label: 'Photos' },
        { id: 'trict', href: 'https://trict.example', label: 'Trict' },
      ],
    })

    expect(screen.getByRole('link', { name: 'Home' }).querySelector('svg')).toHaveClass('lucide-house')
    expect(screen.getByRole('link', { name: 'Photos' }).querySelector('svg')).toHaveClass('lucide-camera')
    expect(screen.getByRole('link', { name: 'Trict' }).querySelector('svg')).toHaveClass('lucide-chart-line')
  })

  it('lets an explicit per-item icon override the catalog default', () => {
    renderShell({
      destinations: [
        { id: 'photos', href: 'https://photos.example', label: 'Photos', icon: <svg data-testid="custom-icon" /> },
      ],
    })

    const link = screen.getByRole('link', { name: 'Photos' })
    expect(within(link).getByTestId('custom-icon')).toBeInTheDocument()
    expect(link.querySelector('svg.lucide-camera')).not.toBeInTheDocument()
  })
})
