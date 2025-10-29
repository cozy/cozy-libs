import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { mockNativeMethods } from '../../../tests'
import { NativeService } from '../../api'
import { NativeContext, useNativeIntent } from '../../view'

describe('useNativeIntent', () => {
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
