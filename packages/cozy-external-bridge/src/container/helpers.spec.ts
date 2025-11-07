import { extractUrl, handleParentOriginRequest } from './helpers'

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

describe('handleParentOriginRequest', () => {
  it('should return undefined when event.origin is different from url origin', () => {
    const mockPostMessage = jest.fn()
    const url = 'http://expected-origin.com'
    const eventOrigin = 'http://different-origin.com'
    const mockEvent = {
      origin: eventOrigin,
      data: 'requestParentOrigin',
      source: {
        postMessage: mockPostMessage
      }
    } as unknown as MessageEvent

    const result = handleParentOriginRequest(mockEvent, url)

    expect(result).toBeUndefined()
    expect(mockPostMessage).not.toHaveBeenCalled()
  })

  it('should successfully execute postMessage when origins match', () => {
    const mockPostMessage = jest.fn()
    const url = 'http://expected-origin.com'
    const eventOrigin = 'http://expected-origin.com'
    const mockEvent = {
      origin: eventOrigin,
      data: 'requestParentOrigin',
      source: {
        postMessage: mockPostMessage
      }
    } as unknown as MessageEvent

    const result = handleParentOriginRequest(mockEvent, url)

    expect(result).toBeUndefined()
    expect(mockPostMessage).toHaveBeenCalledWith(
      'answerParentOrigin',
      eventOrigin
    )
    expect(mockPostMessage).toHaveBeenCalledTimes(1)
  })
})
