/**
 * Authentik adapter contract. The generated consumer is src/authentik.css.
 *
 * Maps Teal semantic tokens onto Authentik's supported theming surface only:
 * --ak-* variables, PatternFly 4 and 5 global variables, and exposed CSS
 * parts. Never target private shadow-DOM structure. Pinned to the Authentik
 * version below; verify the reference screenshots before upgrading it.
 */
export const authentikVersion = '2026.5'

export const akVariables = {
  '--ak-global--BackgroundColor--100': 'var(--teal-color-background)',
  '--ak-global--Color--100': 'var(--teal-color-on-background)',
  '--ak-font-family-sans-serif': 'var(--teal-font-body)',
}

export const pfVariables = {
  '--pf-global--Color--100': 'var(--teal-color-on-surface)',
  '--pf-global--Color--200': 'var(--teal-color-on-surface-variant)',
  '--pf-global--Color--dark-100': 'var(--teal-color-on-surface)',
  '--pf-global--Color--dark-200': 'var(--teal-color-on-surface-variant)',
  '--pf-global--BackgroundColor--100': 'var(--teal-color-surface)',
  '--pf-global--BackgroundColor--200': 'var(--teal-color-surface-container-high)',
  '--pf-global--BackgroundColor--light-100': 'var(--teal-color-surface)',
  '--pf-global--BackgroundColor--dark-100': 'var(--teal-color-surface)',
  '--pf-global--BackgroundColor--dark-200': 'var(--teal-color-surface-container)',
  '--pf-global--BackgroundColor--dark-300': 'var(--teal-color-surface-container-high)',
  '--pf-global--primary-color--100': 'var(--teal-color-primary)',
  '--pf-global--primary-color--200': 'var(--teal-color-primary-dim)',
  '--pf-global--active-color--100': 'var(--teal-color-primary)',
  '--pf-global--link--Color': 'var(--teal-color-primary)',
  '--pf-global--link--Color--hover': 'var(--teal-color-primary-dim)',
  '--pf-global--success-color--100': 'var(--teal-color-tertiary)',
  '--pf-global--warning-color--100': 'var(--teal-color-warning)',
  '--pf-global--danger-color--100': 'var(--teal-color-error)',
  '--pf-global--info-color--100': 'var(--teal-color-primary)',
  '--pf-global--BorderColor--100': 'var(--teal-color-outline-variant)',
  '--pf-global--BorderColor--300': 'var(--teal-color-outline)',
  '--pf-global--BorderRadius--sm': 'var(--teal-radius-control)',
  '--pf-global--BorderRadius--lg': 'var(--teal-radius-surface)',
  '--pf-global--BoxShadow--sm': 'var(--teal-shadow-raised)',
  '--pf-global--BoxShadow--md': 'var(--teal-shadow-raised)',
  '--pf-global--BoxShadow--lg': 'var(--teal-shadow-overlay)',
  '--pf-global--FontFamily--sans-serif': 'var(--teal-font-body)',
  '--pf-global--FontFamily--heading--sans-serif': 'var(--teal-font-headline)',
  '--pf-global--TransitionDuration': 'var(--teal-motion-standard)',
}

/* Theme-aware mappings. PatternFly components scope their variables inside
/* shadow stylesheets, so only global variables pierce the boundary; the
/* pairings below keep text-on-primary readable in both themes. In light
/* theme Color--light-* is text on the dark teal primary; in dark theme it is
/* the main text color, and the primary surface deepens to match. */
export const pfLightVariables = {
  '--pf-global--Color--light-100': 'var(--teal-color-on-primary)',
  '--pf-global--Color--light-200': 'var(--teal-color-primary-container)',
}

export const pfDarkVariables = {
  '--pf-global--Color--light-100': 'var(--teal-color-on-surface)',
  '--pf-global--Color--light-200': 'var(--teal-color-on-surface-variant)',
  '--pf-global--primary-color--100': 'var(--teal-color-secondary-container)',
  '--pf-global--primary-color--200': 'var(--teal-color-primary)',
  '--pf-global--primary-color--300': 'var(--teal-color-secondary-container)',
  '--pf-global--active-color--100': 'var(--teal-color-secondary-container)',
}
