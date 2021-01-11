import React from 'react'
import { shallow } from 'enzyme'

import { TriggerErrorInfo } from 'components/infos/TriggerErrorInfo'
import { KonnectorJobError } from 'helpers/konnectors'

const fixtures = {
  konnector: {
    name: 'Konnectest',
    vendor_link: 'https://cozy.io'
  },
  error: new KonnectorJobError('LOGIN_FAILED')
}

const tMock = jest.fn().mockImplementation(key => key)

describe('TriggerErrorInfo', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  const props = {
    error: fixtures.error,
    konnector: fixtures.konnector,
    t: tMock
  }

  it('should render', () => {
    const component = shallow(<TriggerErrorInfo {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render regular Error', () => {
    const component = shallow(
      <TriggerErrorInfo
        {...props}
        error={new Error('Something is undefined')}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
