import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { NativeContext, useNativeIntent } from '../../view'
import { NativeService } from '../../api'
import { mockNativeMethods } from '../../../tests'

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
