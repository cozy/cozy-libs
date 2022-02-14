import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { NativeContext } from '../contexts/NativeContext'
import { NativeService } from '../../api/services/NativeService'
import { mockNativeMethods } from '../../tests/mocks'
import { strings } from '../../api/constants'
import { useNativeIntent } from './useNativeIntent'

describe('useNativeIntent', () => {
  it('Should throw if the context does not exist', () => {
    const { result } = renderHook(() => useNativeIntent())

    expect(result?.error?.message).toBe(strings.nativeNoProviderFound)
  })

  it('Should return the context if it exists', () => {
    const wrapper = ({ children }: { children: JSX.Element }): JSX.Element => (
      <NativeContext.Provider value={new NativeService(mockNativeMethods)}>
        {children}
      </NativeContext.Provider>
    )

    const { result } = renderHook(() => useNativeIntent(), { wrapper })

    expect(result.current).toStrictEqual(expect.any(NativeService))
  })
})
