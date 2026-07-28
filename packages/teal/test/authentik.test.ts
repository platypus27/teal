import { readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { resolve } from 'node:path'

const run = promisify(execFile)
const root = resolve(import.meta.dirname, '..')

describe('authentik adapter', () => {
  it('regenerates deterministically from the token source', async () => {
    await expect(
      run(process.execPath, [resolve(root, 'scripts/generate-authentik.mjs'), '--check'], { cwd: root }),
    ).resolves.toBeTruthy()
  })

  it('declares Teal tokens for light and the authentik dark theme hook', async () => {
    const css = await readFile(resolve(root, 'src/authentik.css'), 'utf8')
    expect(css).toContain(':root')
    expect(css).toContain(':root[data-theme="dark"]')
    expect(css).toContain('--teal-color-primary: rgb(0 106 108)')
    expect(css).toMatch(/:root\[data-theme="dark"\][^}]*--teal-color-primary: rgb\(45 212 191\)/s)
  })

  it('redeclares the variable mappings inside the dark theme hook', async () => {
    const css = await readFile(resolve(root, 'src/authentik.css'), 'utf8')
    const darkBlock = css.match(/:root\[data-theme="dark"\] \{(?<body>[^]*?)\n\}/)?.groups?.body ?? ''
    expect(darkBlock).toContain('--pf-global--BackgroundColor--100: var(--teal-color-surface)')
    expect(darkBlock).toContain('--ak-global--BackgroundColor--100: var(--teal-color-background)')
  })

  it('covers the PatternFly light and dark swap-source variables', async () => {
    const css = await readFile(resolve(root, 'src/authentik.css'), 'utf8')
    expect(css).toContain('--pf-global--Color--light-100: var(--teal-color-on-surface)')
    expect(css).toContain('--pf-global--Color--dark-100: var(--teal-color-on-surface)')
    expect(css).toContain('--pf-global--BackgroundColor--dark-100: var(--teal-color-surface)')
    expect(css).toContain('--pf-global--BackgroundColor--light-100: var(--teal-color-surface)')
  })

  it('maps supported ak, PF4, and PF5 variables to Teal token references', async () => {
    const css = await readFile(resolve(root, 'src/authentik.css'), 'utf8')
    expect(css).toContain('--ak-global--BackgroundColor--100: var(--teal-color-background)')
    expect(css).toContain('--pf-global--primary-color--100: var(--teal-color-primary)')
    expect(css).toContain('--pf-v5-global--primary-color--100: var(--teal-color-primary)')
    expect(css).toContain('--pf-global--FontFamily--sans-serif: var(--teal-font-body)')
  })

  it('pairs button contrast through theme-aware swap-source mappings', async () => {
    const css = await readFile(resolve(root, 'src/authentik.css'), 'utf8')
    const darkBlock = css.match(/:root\[data-theme="dark"\] \{(?<body>[^]*?)\n\}/)?.groups?.body ?? ''
    // Light: primary button is dark teal, so its text follows on-primary.
    expect(css).toContain('--pf-global--Color--light-100: var(--teal-color-on-primary)')
    // Dark: the button surface deepens so near-white dark-theme text stays readable.
    expect(darkBlock).toContain('--pf-global--Color--light-100: var(--teal-color-on-surface)')
    expect(darkBlock).toContain('--pf-global--primary-color--100: var(--teal-color-secondary-container)')
  })

  it('never hardcodes colors in ak or pf mapping declarations', async () => {
    const css = await readFile(resolve(root, 'src/authentik.css'), 'utf8')
    const mappingLines = css
      .split('\n')
      .filter((line) => /^\s*--(?:ak|pf)[a-z0-9-]*--/i.test(line.trimStart()))
    expect(mappingLines.length).toBeGreaterThan(0)
    for (const line of mappingLines) {
      expect(line).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/)
    }
  })

  it('honors reduced motion through PatternFly duration variables', async () => {
    const css = await readFile(resolve(root, 'src/authentik.css'), 'utf8')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toMatch(/prefers-reduced-motion[^]*--pf-global--TransitionDuration/)
  })
})
