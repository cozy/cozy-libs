import 'mutationobserver-shim'
import React from 'react'
import { render } from '@testing-library/react'

import { NativeIntentProvider } from './NativeIntentProvider'
import { mockNativeMethods } from '../../tests/mocks'

describe('NativeIntentProvider', () => {
  it('Should mount', async () => {
    const { findByText } = render(
      <NativeIntentProvider localMethods={mockNativeMethods}>
        Hello
      </NativeIntentProvider>
    )

    expect(await findByText('Hello')).toBeDefined()
  })
})
