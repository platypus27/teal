import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountMenu } from '../src/AccountMenu'

const user = { name: 'Ada Lovelace', email: 'ada@example.com' }

describe('AccountMenu', () => {
  it('opens from the named avatar trigger with a user header', async () => {
    const userEvent_ = userEvent.setup()
    render(<AccountMenu user={user} />)

    await userEvent_.click(screen.getByRole('button', { name: 'Ada Lovelace' }))

    const menu = await screen.findByRole('menu')
    expect(menu).toHaveTextContent('Ada Lovelace')
    expect(menu).toHaveTextContent('ada@example.com')
  })

  it('selects custom items and closes', async () => {
    const userEvent_ = userEvent.setup()
    const onSelect = vi.fn()
    render(<AccountMenu user={user} items={[{ id: 'settings', label: 'Settings', onSelect }]} />)

    await userEvent_.click(screen.getByRole('button', { name: 'Ada Lovelace' }))
    await userEvent_.click(await screen.findByRole('menuitem', { name: 'Settings' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('runs the session-scoped and SSO sign-out actions', async () => {
    const userEvent_ = userEvent.setup()
    const appSignOut = vi.fn()
    const ssoSignOut = vi.fn()
    render(<AccountMenu user={user} appSignOut={{ label: 'Sign out', onSelect: appSignOut }} ssoSignOut={{ label: 'Sign out of everything', onSelect: ssoSignOut }} />)

    await userEvent_.click(screen.getByRole('button', { name: 'Ada Lovelace' }))
    await userEvent_.click(await screen.findByRole('menuitem', { name: 'Sign out' }))
    expect(appSignOut).toHaveBeenCalledTimes(1)

    await userEvent_.click(screen.getByRole('button', { name: 'Ada Lovelace' }))
    await userEvent_.click(await screen.findByRole('menuitem', { name: 'Sign out of everything' }))
    expect(ssoSignOut).toHaveBeenCalledTimes(1)
  })

  it('does not restore focus to the trigger when a sign-out action replaces the surface', async () => {
    const userEvent_ = userEvent.setup()
    render(<AccountMenu user={user} appSignOut={{ label: 'Sign out', onSelect: () => {} }} />)
    const button = screen.getByRole('button', { name: 'Ada Lovelace' })

    await userEvent_.click(button)
    await userEvent_.click(await screen.findByRole('menuitem', { name: 'Sign out' }))
    // The sign-out replaces the surface (full navigation on success, or an
    // error state on failure): the menu must not park focus back on the
    // trigger. The trigger restore is deferred; settle past it.
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)))
    expect(button).not.toHaveFocus()
  })

  it('restores focus to the trigger when a plain item is selected', async () => {
    const userEvent_ = userEvent.setup()
    render(<AccountMenu user={user} items={[{ id: 'settings', label: 'Settings', onSelect: () => {} }]} />)
    const button = screen.getByRole('button', { name: 'Ada Lovelace' })

    await userEvent_.click(button)
    await userEvent_.click(await screen.findByRole('menuitem', { name: 'Settings' }))
    await act(() => new Promise((resolve) => setTimeout(resolve, 100)))
    expect(button).toHaveFocus()
  })
})
