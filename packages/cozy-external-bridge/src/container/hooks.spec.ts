import { renderHook } from '@testing-library/react-hooks'
import { useLocation } from 'react-router-dom'

import { getIframe } from './helpers'
import { useRedirectOnLoad } from './useRedirectOnLoad'

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn()
}))

jest.mock('./helpers', () => ({
  getIframe: jest.fn()
}))

const mockedUseLocation = useLocation as jest.Mock
const mockedGetIframe = getIframe as jest.Mock

describe('useInitialRedirection', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should not modify iframe.src when pathname does not start with bridge prefix', () => {
    const mockLocation = { pathname: 'assistant', hash: '', search: '' }
    mockedUseLocation.mockReturnValue(mockLocation)

    const mockIframe = { src: 'https://alice-chat.mycozy.cloud' }
    mockedGetIframe.mockReturnValue(mockIframe)

    renderHook(() => useRedirectOnLoad())

    expect(mockIframe.src).toBe('https://alice-chat.mycozy.cloud')
  })

  it('should modify iframe.src when pathname start with bridge prefix', () => {
    const mockLocation = { pathname: '/bridge/welcome', hash: '', search: '' }
    mockedUseLocation.mockReturnValue(mockLocation)

    const mockIframe = { src: 'https://alice-chat.mycozy.cloud' }
    mockedGetIframe.mockReturnValue(mockIframe)

    renderHook(() => useRedirectOnLoad())

    expect(mockIframe.src).toBe('https://alice-chat.mycozy.cloud/welcome')
  })

  it('should modify iframe.src when pathname start with bridge prefix and allow bridge keyword in iframe url', () => {
    const mockLocation = {
      pathname: '/bridge/welcome/bridge',
      hash: '',
      search: ''
    }
    mockedUseLocation.mockReturnValue(mockLocation)

    const mockIframe = { src: 'https://alice-chat.mycozy.cloud' }
    mockedGetIframe.mockReturnValue(mockIframe)

    renderHook(() => useRedirectOnLoad())

    expect(mockIframe.src).toBe(
      'https://alice-chat.mycozy.cloud/welcome/bridge'
    )
  })
})
