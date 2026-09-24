import { warnDeprecated } from '../src/warn-once'

describe('warnDeprecated', () => {
  it('warns once per key and stays silent for unknown keys', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      warnDeprecated('test.old-prop', 'old-prop is deprecated, use new-prop.')
      warnDeprecated('test.old-prop', 'old-prop is deprecated, use new-prop.')
      warnDeprecated('test.other', 'other is deprecated.')

      expect(warn).toHaveBeenCalledTimes(2)
      expect(warn).toHaveBeenNthCalledWith(1, '[@kryv/teal] Deprecated: old-prop is deprecated, use new-prop.')
    } finally {
      warn.mockRestore()
    }
  })

  it('never warns in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      warnDeprecated('test.prod', 'should not appear')
      expect(warn).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllEnvs()
      warn.mockRestore()
    }
  })
})
