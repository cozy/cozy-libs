import { extractUrl } from './helpers'

describe('extractUrl', () => {
  it('should extract pathname, hash, and search from a URL starting with http', () => {
    const url = 'http://example.com/path#fragment?query=123'
    const expected = '/path#fragment?query=123'
    expect(extractUrl(url)).toBe(expected)
  })

  it('should return the URL unchanged if it does not start with http', () => {
    const url = '/path?query=123#fragment'
    const expected = '/path?query=123#fragment'
    expect(extractUrl(url)).toBe(expected)
  })
})
