import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('styles.css forced-colors support', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../src/styles.css'), 'utf8')
  const forcedColorsBlock = css.match(/@media \(forced-colors: active\) \{([\s\S]*?)\n\}/)?.[1] ?? ''

  it('keeps the switch thumb visible and distinguishes the checked state', () => {
    expect(forcedColorsBlock).toContain('.teal-switch-thumb.teal-switch-thumb')
    expect(forcedColorsBlock).toContain('.teal-switch-root.teal-switch-root[data-state=\'checked\']')
    expect(forcedColorsBlock).toContain('Highlight')
    expect(forcedColorsBlock).toContain('CanvasText')
  })

  it('renders disabled buttons in the system disabled color', () => {
    expect(forcedColorsBlock).toContain('.teal-button.teal-button:disabled')
    expect(forcedColorsBlock).toContain('.teal-icon-button.teal-icon-button:disabled')
    expect(forcedColorsBlock).toContain('GrayText')
  })

  it('travels the switch thumb inside the track in both directions and sizes', () => {
    expect(css).toContain('.teal-switch-root[data-state=\'checked\'] .teal-switch-thumb {\n  margin-inline-start: 21px;\n}')
    expect(css).toContain('.teal-switch-root.teal-u-h-5[data-state=\'checked\'] .teal-switch-thumb {\n  margin-inline-start: 17px;\n}')
    expect(css).toContain('.teal-switch-root .teal-switch-thumb {\n  margin-inline-start: 1px;\n  transition: margin-inline-start var(--teal-motion-standard) ease-out;\n}')
  })
})
