import { Page, Section } from '../../components/Page.jsx'

const SIZES = [
  ['text-base', '16px'],
  ['text-[20px]', '20px'],
  ['text-2xl', '24px'],
  ['text-4xl', '36px'],
]

export function Iconography() {
  return (
    <Page
      title="Iconography"
      description="Icons come from Material Symbols Outlined, loaded globally. They are tuned with font-variation-settings and sized with text utilities so they track the surrounding type."
    >
      <Section title="Sizes">
        <div className="flex flex-wrap items-end gap-6 rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
          {SIZES.map(([cls, px]) => (
            <div key={cls} className="flex flex-col items-center gap-2">
              <span className={`material-symbols-outlined ${cls} text-on-surface`}>star</span>
              <code className="monotype text-[10px] text-on-surface-variant">{cls}</code>
              <span className="text-[10px] text-on-surface-variant/70">{px}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Fill & weight">
        <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-on-surface">favorite</span>
            <span className="text-xs text-on-surface-variant">FILL 0</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <span className="text-xs text-on-surface-variant">FILL 1 (emphasis)</span>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant">
          The default is <code className="monotype text-xs">FILL 0, wght 400, opsz 24</code> (set in global.css). Use FILL 1 for selected/active
          states — for example the toast tone icons.
        </p>
      </Section>

      <Section title="When to use SVG instead">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5 text-sm leading-relaxed text-on-surface-variant">
          For very small functional glyphs (≤16px) like the <strong className="text-on-surface">Checkbox</strong> check, prefer an inline SVG. Icon
          fonts can blur at tiny sizes and depend on the font loading; an SVG check stays crisp and works offline. Reserve Material Symbols for
          decorative and larger icons.
        </div>
      </Section>
    </Page>
  )
}
