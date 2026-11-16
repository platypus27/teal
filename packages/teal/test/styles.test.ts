import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('styles.css forced-colors support', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../src/styles.css'), 'utf8')
  const forcedColorsBlock = css.match(/@media \(forced-colors: active\) \{([\s\S]*?)\n\}/)?.[1] ?? ''

  it('keeps the switch thumb visible and distinguishes the checked state', () => {
    expect(forcedColorsBlock).toContain('.teal-switch-thumb')
    expect(forcedColorsBlock).toContain('.teal-switch-root[data-state=\'checked\']')
    expect(forcedColorsBlock).toContain('Highlight')
    expect(forcedColorsBlock).toContain('CanvasText')
  })

  it('renders disabled buttons in the system disabled color', () => {
    expect(forcedColorsBlock).toContain('.teal-button:disabled')
    expect(forcedColorsBlock).toContain('.teal-icon-button:disabled')
    expect(forcedColorsBlock).toContain('GrayText')
  })
})
