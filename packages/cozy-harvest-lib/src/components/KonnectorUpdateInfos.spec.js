/* eslint-env jest */
import React from 'react'
import { render } from '@testing-library/react'

import AppLike from '../../test/AppLike'
import KonnectorUpdateInfos from 'components/infos/KonnectorUpdateInfos'

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
