import { render, screen } from '@testing-library/react'
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
})
