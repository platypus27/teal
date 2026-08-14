import { useState } from 'react'
import { SubNav, SubNavItem } from '@kryv/teal'

const settingsSections = [
  { id: 'subnav-general', label: 'General', body: 'Workspace name, logo, and default locale.' },
  { id: 'subnav-members', label: 'Members', body: 'Invite teammates and manage their roles.' },
  { id: 'subnav-billing', label: 'Billing', body: 'Plan, invoices, and payment method.' },
  { id: 'subnav-integrations', label: 'Integrations', body: 'Connect Slack, GitHub, and other tools.' },
  { id: 'subnav-audit', label: 'Audit log', body: 'Every administrative action, in order.' },
]

const yearSections = [2026, 2025, 2024, 2023, 2022, 2021, 2020].map((year) => ({
  id: `subnav-year-${year}`,
  label: String(year),
  body: `Invoices and receipts from ${year}.`,
}))

function AnchoredSubNav({ ariaLabel, initialId, sections }) {
  const [activeId, setActiveId] = useState(initialId)
  return (
    <div className="w-full">
      <SubNav aria-label={ariaLabel}>
        {sections.map((section) => (
          <SubNavItem
            key={section.id}
            active={activeId === section.id}
            href={`#${section.id}`}
            onClick={() => setActiveId(section.id)}
          >
            {section.label}
          </SubNavItem>
        ))}
      </SubNav>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="border-b border-solid border-teal-outline-variant/30 py-4 last:border-0"
        >
          <h3 className="text-sm font-semibold text-teal-on-surface">{section.label}</h3>
          <p className="mt-1 text-sm text-teal-on-surface-variant">{section.body}</p>
        </section>
      ))}
    </div>
  )
}

export function SubNavDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-sm">
        <AnchoredSubNav ariaLabel="Billing history" sections={yearSections} initialId="subnav-year-2026" />
      </div>
    )
  }

  return <AnchoredSubNav ariaLabel="Project settings" sections={settingsSections} initialId="subnav-general" />
}
