import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsShell } from '../src/SettingsShell'
import { StepUpNotice } from '../src/StepUpNotice'

const sections = [
  {
    label: 'Trict',
    items: [
      { id: 'account', label: 'Account', onSelect: vi.fn() },
      { id: 'risk', label: 'Risk', current: true, onSelect: vi.fn() },
      { id: 'schedule', label: 'Schedule', href: '#schedule' },
    ],
  },
  {
    label: 'Ecosystem',
    items: [{ id: 'home', label: 'Back to Home settings', href: 'https://home.example/settings' }],
  },
]

describe('SettingsShell', () => {
  it('renders section groups with anchors for href items and buttons for onSelect items', () => {
    render(
      <SettingsShell sections={sections} title="Risk">
        <p>Risk form</p>
      </SettingsShell>,
    )

    const nav = screen.getByRole('navigation', { name: 'Settings sections' })
    expect(within(nav).getByText('Trict')).toBeInTheDocument()
    expect(within(nav).getByText('Ecosystem')).toBeInTheDocument()
    expect(within(nav).getByRole('button', { name: 'Account' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Schedule' })).toHaveAttribute('href', '#schedule')
    expect(within(nav).getByRole('link', { name: 'Back to Home settings' })).toHaveAttribute(
      'href',
      'https://home.example/settings',
    )
  })

  it('marks the current item with aria-current and calls onSelect on activation', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <SettingsShell
        sections={[{ items: [{ id: 'risk', label: 'Risk', current: true, onSelect }] }]}
        title="Risk"
      >
        <p>Risk form</p>
      </SettingsShell>,
    )

    const current = screen.getByRole('button', { name: 'Risk' })
    expect(current).toHaveAttribute('aria-current', 'page')
    await user.click(current)
    expect(onSelect).toHaveBeenCalled()
  })

  it('renders title, description, notice, save bar, and panel content', () => {
    render(
      <SettingsShell
        sections={sections}
        title="Risk"
        description="Caps the execution worker enforces."
        notice={<StepUpNotice title="Step-up required">Changing risk caps needs fresh verification.</StepUpNotice>}
        saveBar={
          <>
            <button type="button">Save changes</button>
            <span>Unsaved changes</span>
          </>
        }
      >
        <p>Risk form</p>
      </SettingsShell>,
    )

    expect(screen.getByRole('heading', { name: 'Risk' })).toBeInTheDocument()
    expect(screen.getByText('Caps the execution worker enforces.')).toBeInTheDocument()
    expect(screen.getByText('Step-up required')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
    expect(screen.getByText('Risk form')).toBeInTheDocument()
  })

  it('defaults the accent edge to the home product token and accepts another product accent', () => {
    const { container, rerender } = render(
      <SettingsShell sections={sections} title="Risk">
        <p>Risk form</p>
      </SettingsShell>,
    )
    expect(container.firstChild).toHaveStyle({ '--teal-settings-accent': 'var(--teal-color-product-home)' })

    rerender(
      <SettingsShell sections={sections} title="Risk" accent="--teal-color-product-trict">
        <p>Risk form</p>
      </SettingsShell>,
    )
    expect(container.firstChild).toHaveStyle({ '--teal-settings-accent': 'var(--teal-color-product-trict)' })
  })

  it('omits the notice and save bar regions when the slots are not given', () => {
    render(
      <SettingsShell sections={sections} title="Risk">
        <p>Risk form</p>
      </SettingsShell>,
    )

    expect(screen.queryByRole('button', { name: 'Save changes' })).not.toBeInTheDocument()
    expect(screen.queryByText('Step-up required')).not.toBeInTheDocument()
  })
})
