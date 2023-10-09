import { render, act } from '@testing-library/react'
import { NativeMethodsRegister } from 'api'
import 'mutationobserver-shim'
import React, { useEffect } from 'react'

import { mockNativeMethods } from '../../../tests'
import { NativeIntentProvider, useNativeIntent } from '../../view'

describe('NativeIntentProvider', () => {
  it('Should mount', async () => {
    const { findByText } = render(
      <NativeIntentProvider localMethods={mockNativeMethods}>
        Hello
      </NativeIntentProvider>
    )

    expect(await findByText('Hello')).toBeDefined()
  })

  it('Should update localMethods', async () => {
    const { findByText, rerender } = render(
      <NativeIntentProvider localMethods={mockNativeMethods}>
        Hello
      </NativeIntentProvider>
    )

    expect(await findByText('Hello')).toBeDefined()

    rerender(
      <NativeIntentProvider
        localMethods={
          {
            ...mockNativeMethods,
            foo: 'bar'
          } as unknown as NativeMethodsRegister
        }
      >
        Hello
      </NativeIntentProvider>
    )

    expect(await findByText('Hello')).toBeDefined()
  })

  it('Should be available to child on first render without rejecting promises', () => {
    const TestChildComponent = (): JSX.Element => {
      const nativeService = useNativeIntent()

      useEffect(() => {
        const callMethodAsync = async (): Promise<void> => {
          await nativeService?.call('any', 'thing')
        }
        void callMethodAsync()
      }, [nativeService])

      return <div>Child Component</div>
    }

    act(() => {
      render(
        <NativeIntentProvider localMethods={mockNativeMethods}>
          <TestChildComponent />
        </NativeIntentProvider>
      )
    })
  })
})
