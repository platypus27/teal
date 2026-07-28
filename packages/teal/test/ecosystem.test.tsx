import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountMenu, AppSwitcher } from '../src/index'

describe('ecosystem modules', () => {
  describe('AppSwitcher', () => {
    it('lists only the given applications plus an explicit Home destination', async () => {
      const user = userEvent.setup()
      render(
        <AppSwitcher
          trigger={<button type="button">Apps</button>}
          homeHref="https://home.example"
          homeLabel="Home"
          apps={[
            { id: 'yang', label: 'Yang Operations', href: 'https://yang.example' },
            { id: 'photos', label: 'Photos', href: 'https://photos.example' },
          ]}
        />,
      )
      await user.click(screen.getByRole('button', { name: 'Apps' }))
      expect(await screen.findByRole('menuitem', { name: 'Home' })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: 'Yang Operations' })).toBeInTheDocument()
      expect(screen.queryByRole('menuitem', { name: 'Trict' })).not.toBeInTheDocument()
    })

    it('marks the current application with aria-current', async () => {
      const user = userEvent.setup()
      render(
        <AppSwitcher
          trigger={<button type="button">Apps</button>}
          homeHref="https://home.example"
          homeLabel="Home"
          apps={[
            { id: 'yang', label: 'Yang Operations', href: 'https://yang.example', current: true },
            { id: 'photos', label: 'Photos', href: 'https://photos.example' },
          ]}
        />,
      )
      await user.click(screen.getByRole('button', { name: 'Apps' }))
      expect(await screen.findByRole('menuitem', { name: 'Yang Operations' })).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('menuitem', { name: 'Photos' })).not.toHaveAttribute('aria-current')
    })

    it('reports the selected destination through onNavigate from the keyboard', async () => {
      const user = userEvent.setup()
      const onNavigate = vi.fn()
      render(
        <AppSwitcher
          trigger={<button type="button">Apps</button>}
          homeHref="https://home.example"
          homeLabel="Home"
          onNavigate={onNavigate}
          apps={[
            { id: 'yang', label: 'Yang Operations', href: 'https://yang.example' },
            { id: 'photos', label: 'Photos', href: 'https://photos.example' },
          ]}
        />,
      )
      screen.getByRole('button', { name: 'Apps' }).focus()
      await user.keyboard('{Enter}')
      await screen.findByRole('menu')
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
      expect(onNavigate).toHaveBeenCalledWith('photos')
    })
  })

  describe('AccountMenu', () => {
    it('shows the household identity and keeps app and SSO sign-out distinct', async () => {
      const user = userEvent.setup()
      const onAppSignOut = vi.fn()
      const onSsoSignOut = vi.fn()
      render(
        <AccountMenu
          user={{ name: 'Avery Chen', email: 'avery@example.com' }}
          appSignOut={{ label: 'Sign out of Photos', onSelect: onAppSignOut }}
          ssoSignOut={{ label: 'Sign out everywhere', onSelect: onSsoSignOut }}
        />,
      )
      await user.click(screen.getByRole('button', { name: 'Avery Chen' }))
      expect(await screen.findByText('avery@example.com')).toBeInTheDocument()
      await user.click(screen.getByRole('menuitem', { name: 'Sign out of Photos' }))
      expect(onAppSignOut).toHaveBeenCalledOnce()
      expect(onSsoSignOut).not.toHaveBeenCalled()
    })

    it('runs product items and omits the SSO sign-out when not provided', async () => {
      const user = userEvent.setup()
      const onSessions = vi.fn()
      render(
        <AccountMenu
          user={{ name: 'Avery Chen' }}
          items={[{ id: 'sessions', label: 'Active sessions', onSelect: onSessions }]}
          appSignOut={{ label: 'Sign out of Photos', onSelect: () => {} }}
        />,
      )
      await user.click(screen.getByRole('button', { name: 'Avery Chen' }))
      await user.click(await screen.findByRole('menuitem', { name: 'Active sessions' }))
      expect(onSessions).toHaveBeenCalledOnce()
      await user.click(screen.getByRole('button', { name: 'Avery Chen' }))
      expect(screen.queryByRole('menuitem', { name: /everywhere/i })).not.toBeInTheDocument()
    })
  })
})
