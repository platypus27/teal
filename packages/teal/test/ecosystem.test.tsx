import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountMenu, AppSwitcher, LauncherCard, PermissionMatrix } from '../src/index'

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

  describe('LauncherCard', () => {
    it('links to the application with its label and description', () => {
      render(
        <LauncherCard
          href="https://photos.example"
          label="Photos"
          description="Household media and albums"
        />,
      )
      const link = screen.getByRole('link', { name: /Photos/ })
      expect(link).toHaveAttribute('href', 'https://photos.example')
      expect(link).toHaveTextContent('Household media and albums')
    })

    it('blocks navigation and focus when unavailable', async () => {
      const user = userEvent.setup()
      render(<LauncherCard href="https://trict.example" label="Trict" disabled />)
      const link = screen.getByRole('link', { name: /Trict/ })
      expect(link).toHaveAttribute('aria-disabled', 'true')
      expect(link).toHaveAttribute('tabindex', '-1')
      await user.click(link)
      expect(window.location.href).not.toContain('trict.example')
    })

    it('renders caller-supplied status content', () => {
      render(
        <LauncherCard
          href="https://yang.example"
          label="Yang Operations"
          status={<span>Degraded</span>}
        />,
      )
      expect(screen.getByRole('link', { name: /Yang Operations/ })).toHaveTextContent('Degraded')
    })
  })

  describe('PermissionMatrix', () => {
    it('renders caller-supplied access cells keyed by application column', () => {
      render(
        <PermissionMatrix
          caption="Household application access"
          columns={[
            { id: 'photos', label: 'Photos' },
            { id: 'trict', label: 'Trict' },
          ]}
          rows={[
            {
              id: 'avery',
              label: 'Avery',
              cells: { photos: 'Owner', trict: 'Research' },
            },
          ]}
        />,
      )
      expect(screen.getByRole('table', { name: 'Household application access' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Photos' })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: 'Owner' })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: 'Research' })).toBeInTheDocument()
    })

    it('marks cells with no access entry instead of leaving them blank', () => {
      render(
        <PermissionMatrix
          caption="Household application access"
          columns={[
            { id: 'photos', label: 'Photos' },
            { id: 'trict', label: 'Trict' },
          ]}
          rows={[{ id: 'blair', label: 'Blair', cells: { photos: 'Member' } }]}
        />,
      )
      const row = screen.getByRole('row', { name: /Blair/ })
      expect(within(row).getAllByRole('cell')[2]).toHaveTextContent('—')
    })
  })
})
