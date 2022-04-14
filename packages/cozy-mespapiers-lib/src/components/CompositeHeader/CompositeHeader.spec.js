import React from 'react'
import { render } from '@testing-library/react'

import CompositeHeader from './CompositeHeader'
import AppLike from '../../../test/components/AppLike'

const setup = ({ icon } = {}) => {
  return render(
    <AppLike>
      <CompositeHeader
        icon={icon}
        fallbackIcon={'fallback.svg'}
        iconSize={16}
        title="Title"
        text="Text"
      />
    </AppLike>
  )
}

describe('CompositeHeader', () => {
  it('should use fallbackIcon if icon is undefined', () => {
    const { getByTestId } = setup({ fallbackIcon: 'fallback.svg' })

    expect(getByTestId('fallback.svg'))
  })

  it('should use fallback icon for not supported png', () => {
    const { getByTestId } = setup({ icon: 'illustration.png' })

    expect(getByTestId('fallback.svg'))
  })

  it('should use png if supported', () => {
    const { getByTestId } = setup({ icon: 'IlluIBAN.png' })

    expect(getByTestId('test-file-stub'))
  })
})
