/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { KonnectorUpdateInfos } from 'components/infos/KonnectorUpdateInfos'

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
    const component = shallow(<KonnectorUpdateInfos {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render as blocking', () => {
    const component = shallow(
      <KonnectorUpdateInfos {...props} isBlocking={true} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
