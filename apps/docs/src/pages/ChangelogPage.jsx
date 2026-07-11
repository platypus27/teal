import changelog from '../generated/changelog.json'
import { Page, Section } from '../components/Page.jsx'
import { changelogMarkdown } from '../lib/markdown.js'

export function ChangelogPage() {
  return (
    <Page
      eyebrow="Releases"
      title="Changelog"
      description={`Versioned changes to @kryv/teal, generated from the changesets changelog. Current version: v${changelog.version}.`}
      markdown={changelogMarkdown(changelog)}
    >
      {changelog.entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/50 p-8 text-center">
          <p className="font-bold text-on-surface">No published releases yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
            This page is generated from packages/teal/CHANGELOG.md at build time. Changesets writes that file on
            the first release, and each version appears here automatically.
          </p>
        </div>
      ) : (
        changelog.entries.map((entry) => (
          <Section key={entry.version} title={`v${entry.version}`}>
            <div className="space-y-5">
              {entry.groups.map((group) => (
                <div key={group.label} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    {group.label}
                  </h3>
                  <ul className="space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        ))
      )}
    </Page>
  )
}
