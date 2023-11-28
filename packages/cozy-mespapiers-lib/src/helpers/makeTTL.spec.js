import { makeTTL } from './makeTTL'

describe('makeTTL', () => {
  it('sould return undefined', () => {
    expect(makeTTL()).toBeUndefined()
    expect(makeTTL(123)).toBeUndefined()
    expect(makeTTL('abc')).toBeUndefined()
    expect(makeTTL(new Date('2023-01-01T00:00:00.000Z'))).toBeUndefined()
    expect(makeTTL(new Date('abc'))).toBeUndefined()
    expect(makeTTL('2023-01-01T00:00:00.000Z')).toBeUndefined()
  })
  it('sould return TTL in seconds', () => {
    expect(makeTTL(new Date('2100-01-01T00:00:00.000Z'))).toBeDefined()
    expect(makeTTL('2100-01-01T00:00:00.000Z')).toBeDefined()
  })
})
