/* eslint-env jest */
import { render } from '@testing-library/react'
import KonnectorUpdateInfos from 'components/infos/KonnectorUpdateInfos'
import React from 'react'

import AppLike from '../../../test/AppLike'

jest.mock(
  '../KonnectorUpdateLinker',
  () =>
    ({ konnector, label, isBlocking }) => (
      <div
        data-testtid="KonnectorUpdateLinker"
        data-label={label}
        data-konnector={konnector}
        data-is-blocking={isBlocking}
      />
    )
)

// Default props
const intents = {
  redirect: jest.fn()
}
const konnector = {
  slug: 'test-konnector'
}
const t = key => key

const props = {
  intents,
  konnector,
  t
}

describe('KonnectorUpdateInfos', () => {
  it('should render', () => {
    const root = render(
      <AppLike>
        <KonnectorUpdateInfos {...props} />
      </AppLike>
    )
    expect(
      root.getByText('An update is available for this service.')
    ).toBeTruthy()
    expect(root.queryByText('Update it to keep fetching your data:')).toBe(null)
  })

  it('should render as blocking', () => {
    const root = render(
      <AppLike>
        <KonnectorUpdateInfos {...props} isBlocking={true} />
      </AppLike>
    )
    expect(
      root.getByText('An update is available for this service.')
    ).toBeTruthy()
    expect(root.getByText('Update it to keep fetching your data:')).toBeTruthy()
  })
})
