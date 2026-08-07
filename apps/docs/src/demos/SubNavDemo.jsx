import { SubNav, SubNavItem } from '@kryv/teal'

export function SubNavDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full max-w-sm">
        <SubNav aria-label="Billing history">
          <SubNavItem active href="#2026">
            2026
          </SubNavItem>
          <SubNavItem href="#2025">2025</SubNavItem>
          <SubNavItem href="#2024">2024</SubNavItem>
          <SubNavItem href="#2023">2023</SubNavItem>
          <SubNavItem href="#2022">2022</SubNavItem>
          <SubNavItem href="#2021">2021</SubNavItem>
          <SubNavItem href="#2020">2020</SubNavItem>
        </SubNav>
      </div>
    )
  }

  return (
    <div className="w-full">
      <SubNav aria-label="Project settings">
        <SubNavItem active href="#general">
          General
        </SubNavItem>
        <SubNavItem href="#members">Members</SubNavItem>
        <SubNavItem href="#billing">Billing</SubNavItem>
        <SubNavItem href="#integrations">Integrations</SubNavItem>
        <SubNavItem href="#audit">Audit log</SubNavItem>
      </SubNav>
    </div>
  )
}
