import { createRef } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountMenu } from '../src/AccountMenu'
import { AppSwitcher } from '../src/AppSwitcher'
import { Chip } from '../src/Chip'
import { Command } from '../src/Command'
import { EcosystemRail } from '../src/EcosystemRail'
import { FileUpload } from '../src/FileUpload'
import { Menu } from '../src/Menu'
import { Menubar } from '../src/Menubar'
import { NavigationMenu } from '../src/NavigationMenu'
import { PermissionMatrix } from '../src/PermissionMatrix'
import { Popconfirm } from '../src/Popconfirm'
import { Popover } from '../src/Popover'
import { Tooltip } from '../src/Tooltip'
import { TreeView } from '../src/TreeView'

/**
 * Every public component forwards a ref to its rendered root or surface, so
 * callers can anchor popovers, measure elements, or manage focus uniformly.
 * Popup-family components mount their surface in a portal on open, so their
 * refs only resolve after interaction.
 */
describe('ref forwarding', () => {
  it('forwards refs on always-rendered components', () => {
    const chip = createRef<HTMLSpanElement>()
    render(<Chip ref={chip} label="Tag" />)
    expect(chip.current).toBeInstanceOf(HTMLSpanElement)

    const tree = createRef<HTMLUListElement>()
    render(<TreeView ref={tree} aria-label="Tree" items={[{ id: 'a', label: 'A' }]} />)
    expect(tree.current).toBeInstanceOf(HTMLUListElement)

    const upload = createRef<HTMLDivElement>()
    render(<FileUpload ref={upload} label="Upload" />)
    expect(upload.current).toBeInstanceOf(HTMLDivElement)

    const menubar = createRef<HTMLDivElement>()
    render(<Menubar ref={menubar} label="App" menus={[{ label: 'File', items: [] }]} />)
    expect(menubar.current).toBeInstanceOf(HTMLDivElement)

    const nav = createRef<HTMLElement>()
    render(<NavigationMenu ref={nav} label="Main" items={[{ type: 'link', label: 'Docs', href: '/docs' }]} />)
    expect(nav.current).toBeInstanceOf(HTMLElement)

    const rail = createRef<HTMLElement>()
    render(<EcosystemRail ref={rail} destinations={[]} home={{ href: '/', label: 'Home' }} />)
    expect(rail.current).toBeInstanceOf(HTMLElement)

    const matrix = createRef<HTMLDivElement>()
    render(
      <PermissionMatrix
        ref={matrix}
        caption="Access"
        columns={[{ id: 'app', label: 'App' }]}
        rows={[{ id: 'r1', label: 'Ada', cells: { app: 'edit' } }]}
      />,
    )
    expect(matrix.current).toBeInstanceOf(HTMLDivElement)
  })

  it('resolves the menu ref when the dropdown opens', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLDivElement>()
    render(
      <Menu
        ref={ref}
        label="Actions"
        items={[{ id: 'one', label: 'One', onSelect: () => undefined }]}
        trigger={<button type="button">Open</button>}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('resolves the account menu ref when it opens', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLDivElement>()
    render(<AccountMenu ref={ref} user={{ name: 'Ada Lovelace' }} />)

    await user.click(screen.getByRole('button', { name: 'Ada Lovelace' }))
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('resolves the app switcher ref when it opens', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLDivElement>()
    render(
      <AppSwitcher
        ref={ref}
        apps={[{ id: 'notes', label: 'Notes', href: '/notes' }]}
        homeHref="/"
        homeLabel="Home"
        trigger={<button type="button">Apps</button>}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Apps' }))
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('resolves the popover and popconfirm refs when they open', async () => {
    const user = userEvent.setup()
    const popoverRef = createRef<HTMLDivElement>()
    render(
      <Popover ref={popoverRef} label="Details" trigger={<button type="button">Info</button>}>
        Detail body
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Info' }))
    expect(await screen.findByRole('dialog', { name: 'Details' })).toBeInTheDocument()
    expect(popoverRef.current).toBeInstanceOf(HTMLDivElement)

    const popconfirmRef = createRef<HTMLDivElement>()
    render(
      <Popconfirm ref={popconfirmRef} title="Delete file?" trigger={<button type="button">Delete</button>} />,
    )
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(await screen.findByRole('dialog', { name: 'Delete file?' })).toBeInTheDocument()
    expect(popconfirmRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it('resolves the tooltip ref when it shows', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLDivElement>()
    render(
      <Tooltip ref={ref} content="Helpful hint" delayDuration={0}>
        <button type="button">Help</button>
      </Tooltip>,
    )

    await user.hover(screen.getByRole('button', { name: 'Help' }))
    await waitFor(() => expect(ref.current).toBeInstanceOf(HTMLDivElement))
  })

  it('resolves the command palette ref while open', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Command
        ref={ref}
        open
        groups={[{ label: 'Actions', items: [{ id: 'save', label: 'Save', onSelect: () => undefined }] }]}
      />,
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
