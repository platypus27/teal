declare module 'jest-axe' {
  import type { AxeResults, ImpactValue, RunOptions, Spec } from 'axe-core'

  export interface JestAxeConfigureOptions extends RunOptions {
    globalOptions?: Spec | undefined
    impactLevels?: ImpactValue[]
  }

  export function axe(
    html: Element | Document | string,
    options?: JestAxeConfigureOptions,
  ): Promise<AxeResults>

  export const toHaveNoViolations: Parameters<typeof import('vitest').expect.extend>[0]
}
