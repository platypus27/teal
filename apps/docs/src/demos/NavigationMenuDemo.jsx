import { NavigationMenu } from '@kryv/teal'
import { BarChart3, ShieldCheck, Users } from 'lucide-react'

const panelLinks = [
  { icon: BarChart3, title: 'Reports', description: 'Usage and reliability trends' },
  { icon: ShieldCheck, title: 'Security', description: 'Audit logs and policies' },
  { icon: Users, title: 'Members', description: 'Roles and invitations' },
]

const megaColumns = [
  { heading: 'Build', links: ['Editor', 'Preview'] },
  { heading: 'Ship', links: ['Hosting', 'Analytics'] },
  { heading: 'Learn', links: ['Guides', 'API reference'] },
]

export function NavigationMenuDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <NavigationMenu
        label="Documentation"
        items={[
          { type: 'link', label: 'Getting started', href: '#', active: true },
          { type: 'link', label: 'Components', href: '#' },
          { type: 'link', label: 'Recipes', href: '#' },
          { type: 'link', label: 'Changelog', href: '#' },
        ]}
      />
    )
  }

  if (exampleIndex === 2) {
    return (
      <div className="w-full rounded-xl border border-teal-outline-variant/30 px-4 py-2">
        <NavigationMenu
          label="Products"
          items={[
            {
              type: 'panel',
              label: 'Products',
              content: (
                <div className="flex gap-8">
                  {megaColumns.map(({ heading, links }) => (
                    <div key={heading} className="flex min-w-40 flex-col gap-0.5">
                      <div className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-teal-on-surface-variant">
                        {heading}
                      </div>
                      {links.map((link) => (
                        <a
                          key={link}
                          href="#"
                          className="rounded-lg px-3 py-2 text-sm text-teal-on-surface no-underline hover:bg-teal-surface-container-high hover:text-teal-primary"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              ),
            },
            { type: 'link', label: 'Pricing', href: '#' },
          ]}
        />
      </div>
    )
  }

  return (
    <NavigationMenu
      label="Primary"
      items={[
        { type: 'link', label: 'Overview', href: '#', active: true },
        {
          type: 'panel',
          label: 'Workspace',
          content: (
            <ul className="grid w-80 list-none gap-1 p-0">
              {panelLinks.map(({ icon: Icon, title, description }) => (
                <li key={title}>
                  <a href="#" className="flex items-start gap-3 rounded-lg px-3 py-2 no-underline hover:bg-teal-surface-container-high">
                    <Icon aria-hidden="true" className="mt-0.5 size-4 text-teal-primary" />
                    <span>
                      <span className="block text-sm font-semibold text-teal-on-surface">{title}</span>
                      <span className="block text-xs text-teal-on-surface-variant">{description}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ),
        },
        { type: 'link', label: 'Billing', href: '#' },
      ]}
    />
  )
}
