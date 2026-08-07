import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MegaMenu, MegaMenuColumn, MegaMenuItem, MegaMenuLink } from '../src/MegaMenu'

function renderMegaMenu() {
  return render(
    <MegaMenu>
      <MegaMenuItem label="Products">
        <MegaMenuColumn heading="Build">
          <MegaMenuLink href="#editor">Editor</MegaMenuLink>
          <MegaMenuLink href="#preview">Preview</MegaMenuLink>
        </MegaMenuColumn>
        <MegaMenuColumn heading="Ship">
          <MegaMenuLink href="#hosting">Hosting</MegaMenuLink>
          <MegaMenuLink href="#analytics">Analytics</MegaMenuLink>
        </MegaMenuColumn>
      </MegaMenuItem>
      <MegaMenuItem label="Docs">
        <MegaMenuColumn heading="Learn">
          <MegaMenuLink href="#guides">Guides</MegaMenuLink>
          <MegaMenuLink href="#api">API reference</MegaMenuLink>
        </MegaMenuColumn>
      </MegaMenuItem>
    </MegaMenu>,
  )
}

describe('MegaMenu', () => {
  it('renders a navigation landmark with collapsed triggers', () => {
    renderMegaMenu()

    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Products/ })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Editor' })).not.toBeInTheDocument()
  })

  it('opens the panel on click and closes on a second click', () => {
    renderMegaMenu()
    const trigger = screen.getByRole('button', { name: /Products/ })

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Editor' })).toBeInTheDocument()

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Editor' })).not.toBeInTheDocument()
  })

  it('opens on hover and closes when the pointer leaves', () => {
    renderMegaMenu()
    const trigger = screen.getByRole('button', { name: /Products/ })
    const item = trigger.closest('li') as HTMLElement

    fireEvent.mouseEnter(item)
    expect(screen.getByRole('link', { name: 'Editor' })).toBeInTheDocument()

    fireEvent.mouseLeave(item)
    expect(screen.queryByRole('link', { name: 'Editor' })).not.toBeInTheDocument()
  })

  it('closes on Escape and returns focus to the trigger', () => {
    renderMegaMenu()
    const trigger = screen.getByRole('button', { name: /Products/ })

    fireEvent.click(trigger)
    fireEvent.keyDown(screen.getByRole('link', { name: 'Editor' }), { key: 'Escape' })

    expect(screen.queryByRole('link', { name: 'Editor' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('opens the panel and focuses the first link on ArrowDown', async () => {
    renderMegaMenu()
    const trigger = screen.getByRole('button', { name: /Products/ })

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    await waitFor(() => expect(screen.getByRole('link', { name: 'Editor' })).toHaveFocus())
  })

  it('moves across columns with ArrowRight and ArrowLeft inside the panel', () => {
    renderMegaMenu()
    fireEvent.click(screen.getByRole('button', { name: /Products/ }))

    const preview = screen.getByRole('link', { name: 'Preview' })
    preview.focus()
    fireEvent.keyDown(preview, { key: 'ArrowRight' })
    expect(screen.getByRole('link', { name: 'Hosting' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('link', { name: 'Hosting' }), { key: 'ArrowLeft' })
    expect(screen.getByRole('link', { name: 'Preview' })).toHaveFocus()
  })

  it('moves between triggers with arrow keys and follows with the open panel', () => {
    renderMegaMenu()
    const products = screen.getByRole('button', { name: /Products/ })
    const docs = screen.getByRole('button', { name: /Docs/ })

    fireEvent.click(products)
    fireEvent.keyDown(products, { key: 'ArrowRight' })

    expect(docs).toHaveFocus()
    expect(docs).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Guides' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Editor' })).not.toBeInTheDocument()
  })

  it('returns focus to the trigger with ArrowUp from a link', () => {
    renderMegaMenu()
    const trigger = screen.getByRole('button', { name: /Products/ })

    fireEvent.click(trigger)
    const link = screen.getByRole('link', { name: 'Editor' })
    link.focus()
    fireEvent.keyDown(link, { key: 'ArrowUp' })

    expect(trigger).toHaveFocus()
  })
})
