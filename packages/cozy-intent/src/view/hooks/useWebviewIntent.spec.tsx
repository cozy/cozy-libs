import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { WebviewContext } from '../contexts/WebviewContext'
import { WebviewService } from '../../api/services/WebviewService'
import { mockConnection } from '../../tests/mocks'
import { strings } from '../../api/constants'
import { useWebviewIntent } from './useWebviewIntent'

jest.mock('cozy-device-helper', () => ({
  isFlagshipApp: jest.fn(() => true)
}))

describe('useNativeIntent', () => {
  it('Should throw if the context does not exist in a Flagship app', () => {
    const { result } = renderHook(() => useWebviewIntent())
    expect(result?.error?.message).toBe(strings.webviewNoProviderFound)
  })

  it('Should return the context if it exists', () => {
    const wrapper = ({ children }: { children: JSX.Element }): JSX.Element => (
      <WebviewContext.Provider value={new WebviewService(mockConnection)}>
        {children}
      </WebviewContext.Provider>
    )

    const { result } = renderHook(() => useWebviewIntent(), { wrapper })

    expect(result.current).toStrictEqual(expect.any(WebviewService))
  })
})
