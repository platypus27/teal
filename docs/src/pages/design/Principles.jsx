import { Page, Section } from '../../components/Page.jsx'

function Principle({ n, title, children, do: doText, dont: dontText }) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{n}</span>
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{children}</p>
        </div>
      </div>
      {(doText || dontText) && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {doText && (
            <div className="rounded-lg border border-tertiary/30 bg-tertiary/5 px-3 py-2 text-xs text-on-surface">
              <span className="font-bold text-tertiary">Do</span> — {doText}
            </div>
          )}
          {dontText && (
            <div className="rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-xs text-on-surface">
              <span className="font-bold text-error">Don&apos;t</span> — {dontText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Principles() {
  return (
    <Page
      title="Principles"
      description="Teal is a calm, teal-forward system built on Material-3 surfaces. A few rules keep every screen feeling like one product — and the React modules in ui/ are the single source of truth for all of them."
    >
      <Section title="Voice">
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Quiet by default. Surfaces layer with soft elevation instead of heavy outlines; colour is reserved for action and
          meaning; motion is short and purposeful. The interface should feel precise, not decorated.
        </p>
      </Section>

      <Section title="Rules">
        <div className="grid gap-4">
          <Principle n="1" title="Surfaces over borders" do="Layer surface-container tones and a soft shadow" dont="Outline every card with a hard 1px rule">
            Build depth with the surface scale and elevation, not with borders. Borders exist for separators and inputs, not as the
            default way to group content.
          </Principle>
          <Principle n="2" title="Radius matches size" do="rounded-full on Button, Badge, Toggle" dont="Stadium corners on a 120px textarea">
            Single-line controls can be pills; tall panels and large surfaces get a modest radius. Nested radii follow{' '}
            <code className="monotype text-xs">outer = inner + padding</code>.
          </Principle>
          <Principle n="3" title="Colour carries meaning" do="primary = action, tertiary = success, error = danger" dont="Decorate with brand colour">
            Use the semantic roles, not raw hex. Primary drives actions, tertiary signals success, error warns of danger, warning
            signals caution, and the surface/outline tokens do the structural work.
          </Principle>
          <Principle n="4" title="Focus is always visible" do="Keep the primary focus ring on every control" dont="Remove outlines without a replacement">
            Keyboard users get a consistent primary ring on inputs, buttons, checkboxes, switches and dialogs.
          </Principle>
          <Principle n="5" title="One source of truth" do="Import from teal/ui and the Tailwind preset" dont="Reach for the deprecated @layer classes">
            The React modules and tokens are authoritative. The legacy <code className="monotype text-xs">.card</code>/
            <code className="monotype text-xs">.btn-primary</code> classes in global.css exist only for old consumers.
          </Principle>
        </div>
      </Section>
    </Page>
  )
}
