import 'mutationobserver-shim'
import React from 'react'
import { render } from '@testing-library/react'

import { mockNativeMethods } from '../../../tests'
import { NativeIntentProvider } from '../../view'

import { NativeMethodsRegister } from 'api'

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
})
