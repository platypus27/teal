import { migrateSource } from '../scripts/migrate-consolidation.mjs'

describe('migrate-consolidation codemod', () => {
  it('renames tags, adds constant attributes, and preserves everything else', () => {
    const source = `import { PulseDot, HoverCard, StatusDot } from '@kryv/teal'

// keep this comment
export function Header({ online }: { online: boolean }) {
  return (
    <div className="row">
      <PulseDot />
      <HoverCard
        trigger={<span>info</span>}
        label="Info"
      >
        body
      </HoverCard>
      <StatusDot pulse />
    </div>
  )
}
`
    const { code, warnings } = migrateSource(source)

    expect(code).toContain('<StatusDot pulse />')
    expect(code).toContain('<Popover openOn="hover"\n        trigger=')
    expect(code).toContain('</Popover>')
    expect(code).toContain("// keep this comment")
    expect(code).toContain('online }: { online: boolean }')
    // Pre-existing correct usage is untouched and not double-flagged.
    expect(code.split('<StatusDot pulse />').length - 1).toBe(2)
    expect(code).not.toContain('PulseDot')
    expect(warnings.join('\n')).not.toContain('StatusDot')
  })

  it('renames aliased imports and warns on manual-followup cases once', () => {
    const source = `import { MonthPicker as LegacyPicker, Drawer } from '@kryv/teal'

export const A = () => <LegacyPicker value="2024-01" />
export const B = () => <Drawer open side="left">x</Drawer>
`
    const { code, warnings } = migrateSource(source)

    expect(code).toContain('DatePicker as LegacyPicker')
    expect(code).toContain('<LegacyPicker value="2024-01" />')
    expect(code).toContain('<Dialog open side="left">x</Dialog>')
    expect(warnings.filter((line) => line.includes('MonthPicker'))).toHaveLength(1)
    expect(warnings.join('\n')).toContain('Drawer → Dialog: choose placement="left" or "right"')
  })

  it('leaves unrelated identifiers and other packages alone', () => {
    const source = `import { Drawer } from 'other-ui'
import Panel from './local/Panel'

export const A = () => <Drawer open />
export const B = <Panel title="local" />
`
    const { code, warnings } = migrateSource(source)

    expect(code).toBe(source)
    expect(warnings).toHaveLength(0)
  })

  it('does not duplicate attributes that already exist', () => {
    const source = `import { SegmentedControl } from '@kryv/teal'
export const A = () => <SegmentedControl variant="segmented" options={options} />
`
    const { code } = migrateSource(source)

    expect(code).toContain('<ToggleGroup variant="segmented" options={options} />')
    expect((code.match(/variant="segmented"/g) ?? []).length).toBe(1)
  })
})
