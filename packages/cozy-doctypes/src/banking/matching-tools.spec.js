const { eitherIncludes } = require('./matching-tools')

describe('either includes', () => {
  it('should work', () => {
    expect(eitherIncludes('ABC', 'ABCDEF')).toBe(true)
    expect(eitherIncludes(undefined, 'ABCDEF')).toBe(false)
    expect(eitherIncludes(undefined, undefined)).toBe(false)
    expect(eitherIncludes('DEFGHI', 'DEF')).toBe(true)
  })
})
