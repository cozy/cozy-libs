import React from 'react'
import { shallow } from 'enzyme'

import { AccountFormError } from 'components/AccountForm/Error'
import { KonnectorJobError } from 'helpers/konnectors'

const fixtures = {
  konnector: {
    name: 'Konnectest',
    vendor_link: 'https://cozy.io'
  },
  error: new KonnectorJobError('LOGIN_FAILED')
}

const tMock = jest.fn().mockImplementation(key => key)

describe('AccountFormError', () => {
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
    const component = shallow(<AccountFormError {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render regular Error', () => {
    const component = shallow(
      <AccountFormError
        {...props}
        error={new Error('Something is undefined')}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
