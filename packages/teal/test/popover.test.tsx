import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../src/Button'
import { Popover } from '../src/Popover'

describe('Popover click mode', () => {
  it('anchors content to the trigger and names the dialog', async () => {
    const user = userEvent.setup()
    render(
      <Popover label="Workspace navigation" trigger={<Button>Open</Button>}>
        <p>Filter controls</p>
      </Popover>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(await screen.findByText('Filter controls')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Workspace navigation' })).toBeInTheDocument()
  })
})

describe('Popover hover mode', () => {
  function renderHover() {
    return render(
      <Popover label="Preview" openOn="hover" openDelay={0} closeDelay={0} trigger={<a href="/u/teal">@teal</a>}>
        <p>Profile preview</p>
      </Popover>,
    )
  }

  it('reveals its content on hover', async () => {
    const user = userEvent.setup()
    renderHover()

    await user.hover(screen.getByRole('link', { name: '@teal' }))

    expect(await screen.findByText('Profile preview')).toBeInTheDocument()
  })

  it('reveals its content on keyboard focus', async () => {
    const user = userEvent.setup()
    renderHover()

    await user.tab()
    expect(screen.getByRole('link', { name: '@teal' })).toHaveFocus()
    expect(await screen.findByText('Profile preview')).toBeInTheDocument()
  })

  it('honors the requested side', async () => {
    const user = userEvent.setup()
    render(
      <Popover label="Preview" openOn="hover" side="top" openDelay={0} closeDelay={0} trigger={<a href="/u/teal">@teal</a>}>
        <p>Profile preview</p>
      </Popover>,
    )

    await user.hover(screen.getByRole('link', { name: '@teal' }))
    const content = await screen.findByText('Profile preview')

    expect(content.closest('[data-side]')).toHaveAttribute('data-side', 'top')
  })
})
