import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { mockConnection } from '../../../tests'
import { WebviewService } from '../../api'
import { WebviewContext, useWebviewIntent } from '../../view'

describe('useNativeIntent', () => {
  it('Should not throw if the context does not exist in a Flagship app', () => {
    const { result } = renderHook(() => useWebviewIntent())

    expect(result.current).toBeUndefined()
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
