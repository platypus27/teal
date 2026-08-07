import { MegaMenu, MegaMenuColumn, MegaMenuItem, MegaMenuLink } from '@kryv/teal'

export function MegaMenuDemo({ exampleIndex = 0 }) {
  if (exampleIndex === 1) {
    return (
      <div className="w-full rounded-xl border border-teal-outline-variant/30 px-4 py-2">
        <MegaMenu aria-label="Store">
          <MegaMenuItem label="Solutions">
            <MegaMenuColumn heading="By team">
              <MegaMenuLink href="#engineering">Engineering</MegaMenuLink>
              <MegaMenuLink href="#design">Design</MegaMenuLink>
              <MegaMenuLink href="#marketing">Marketing</MegaMenuLink>
            </MegaMenuColumn>
            <MegaMenuColumn heading="By size">
              <MegaMenuLink href="#startups">Startups</MegaMenuLink>
              <MegaMenuLink href="#enterprise">Enterprise</MegaMenuLink>
            </MegaMenuColumn>
            <MegaMenuColumn heading="By industry">
              <MegaMenuLink href="#finance">Finance</MegaMenuLink>
              <MegaMenuLink href="#health">Healthcare</MegaMenuLink>
              <MegaMenuLink href="#retail">Retail</MegaMenuLink>
            </MegaMenuColumn>
          </MegaMenuItem>
          <MegaMenuItem label="Pricing">
            <MegaMenuColumn heading="Plans">
              <MegaMenuLink href="#free">Free</MegaMenuLink>
              <MegaMenuLink href="#pro">Pro</MegaMenuLink>
            </MegaMenuColumn>
          </MegaMenuItem>
        </MegaMenu>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl border border-teal-outline-variant/30 px-4 py-2">
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
      </MegaMenu>
    </div>
  )
}
