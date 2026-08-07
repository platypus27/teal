import { render, screen } from '@testing-library/react'
import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, AppShellSidebar } from '../src/AppShell'

function renderShell() {
  return render(
    <AppShell data-testid="shell">
      <AppShellHeader>Header</AppShellHeader>
      <AppShellSidebar>Sidebar</AppShellSidebar>
      <AppShellMain>Main</AppShellMain>
      <AppShellFooter>Footer</AppShellFooter>
    </AppShell>,
  )
}

describe('AppShell', () => {
  it('renders a full-height grid frame', () => {
    renderShell()

    const shell = screen.getByTestId('shell')
    expect(shell.className).toContain('teal-u-grid')
    expect(shell.className).toContain('teal-u-min-h-dvh')
    expect(shell.style.gridTemplateAreas).toContain('"sidebar main"')
  })

  it('places each region in its named grid area', () => {
    renderShell()

    expect(screen.getByText('Header').style.gridArea).toBe('header')
    expect(screen.getByText('Sidebar').style.gridArea).toBe('sidebar')
    expect(screen.getByText('Main').style.gridArea).toBe('main')
    expect(screen.getByText('Footer').style.gridArea).toBe('footer')
  })

  it('uses semantic landmarks for the regions', () => {
    renderShell()

    expect(screen.getByRole('banner')).toHaveTextContent('Header')
    expect(screen.getByRole('complementary')).toHaveTextContent('Sidebar')
    expect(screen.getByRole('main')).toHaveTextContent('Main')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer')
  })

  it('gives the sidebar a default width that can be overridden', () => {
    render(
      <AppShell>
        <AppShellSidebar data-testid="sidebar">Sidebar</AppShellSidebar>
      </AppShell>,
    )
    expect(screen.getByTestId('sidebar').style.width).toBe('256px')

    render(
      <AppShell>
        <AppShellSidebar data-testid="wide" width="20rem">
          Sidebar
        </AppShellSidebar>
      </AppShell>,
    )
    expect(screen.getByTestId('wide').style.width).toBe('20rem')
  })

  it('keeps the main region shrinkable inside the grid', () => {
    renderShell()
    expect(screen.getByRole('main').className).toContain('teal-u-min-w-0')
  })

  it('merges caller classNames on regions', () => {
    render(
      <AppShell>
        <AppShellHeader data-testid="header" className="teal-u-px-6">
          Header
        </AppShellHeader>
      </AppShell>,
    )
    expect(screen.getByTestId('header').className).toContain('teal-u-px-6')
  })
})
