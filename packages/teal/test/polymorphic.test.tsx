import { createRef, forwardRef } from 'react'
import { render, screen } from '@testing-library/react'
import { Button, Card, Sidebar, SidebarItem, TopBar } from '../src/index'

const RouterLink = forwardRef<HTMLAnchorElement, { href: string; children: React.ReactNode }>(
  function RouterLink({ href, children }, ref) {
    return <a ref={ref} href={href}>{children}</a>
  },
)

const typeFixtures = (
  <>
    <Card as="a" href="/reports" />
    <Card as="button" type="button" disabled />
    <TopBar as="a" href="/settings" />
    <Sidebar as="aside" />
    <SidebarItem as={RouterLink} href="/settings">Settings</SidebarItem>
    {/* @ts-expect-error asChild links cannot be disabled by the Button contract. */}
    <Button asChild disabled><a href="/settings">Settings</a></Button>
    {/* @ts-expect-error href is not a valid prop for a button card. */}
    <Card as="button" href="/reports" />
  </>
)

void typeFixtures

describe('polymorphic surfaces and navigation', () => {
  it('preserves target element props and refs', () => {
    const cardRef = createRef<HTMLAnchorElement>()
    const navRef = createRef<HTMLAnchorElement>()
    render(
      <>
        <Card as="a" href="/reports" ref={cardRef}>Reports</Card>
        <TopBar as="div" data-testid="top-bar" />
        <Sidebar as="aside" aria-label="Workspace" />
        <SidebarItem as={RouterLink} href="/settings" ref={navRef}>Settings</SidebarItem>
      </>,
    )

    expect(cardRef.current).toBe(screen.getByRole('link', { name: 'Reports' }))
    expect(navRef.current).toBe(screen.getByRole('link', { name: 'Settings' }))
    expect(screen.getByTestId('top-bar').tagName).toBe('DIV')
    expect(screen.getByRole('complementary', { name: 'Workspace' }).tagName).toBe('ASIDE')
  })
})
