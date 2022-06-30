import { getLinksType } from './getLinksType'

describe('getLinksType', () => {
  it('should return "small" string', () => {
    const res = getLinksType({ _id: 0, class: 'image' })

    expect(res).toBe('small')
  })
  it('should return "icon" string', () => {
    const res = getLinksType({ _id: 1, class: 'pdf' })

    expect(res).toBe('icon')
  })
  it('should return undefined', () => {
    const res = getLinksType({ _id: 2, class: 'text' })

    expect(res).toBeUndefined()
  })
})
