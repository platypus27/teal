---
'@kryv/teal': minor
---

Refine the visual tokens and fix two dark-mode/contrast issues.

- Tighter radius ramp: `--teal-radius-control` 1rem → 0.5rem, `--teal-radius-surface` 1.25rem → 0.75rem for a crisper, more deliberate look.
- Calmer elevation: softer `--teal-shadow-raised` and `--teal-shadow-overlay` with less spread and lower opacity.
- Dark mode no longer drops `--teal-color-surface-container-lowest` to pure black; it now sits on the surface ramp (rgb(7 31 32)) so cards and panels stay layered against the background.
- `Switch` unchecked state is no longer a white thumb on a white track: in light mode the thumb is solid teal on a white track with a hairline border; in dark mode the thumb stays white on a teal-tinted track.
- Motion on every state change, all honoring `prefers-reduced-motion`: checkbox marks pop in, the switch thumb settles with a pulse, tab panels fade in on switch, popovers/menus/tooltips/select dropdowns get a fade-and-rise entrance, toasts slide in and fade out, and accordion sections animate their height.
- `Tabs` now slides a single measured pill behind the active trigger instead of swapping backgrounds per tab.
- Form controls (`Input`, `TextArea`, `Select`, `Checkbox`, `Switch`) default to hairline (`--teal-border-subtle`) borders that strengthen on hover/focus.
