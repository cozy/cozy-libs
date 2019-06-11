import React from 'react'
import { shallow } from 'enzyme'

import DeleteAccountCard from 'components/cards/DeleteAccountCard'

const fixtures = {
  account: {
    _id: '1865a2e044414a15aebbad75ca96c5cc'
  }
}

const props = {
  account: fixtures.account,
  onSuccess: jest.fn(),
  t: key => key
}

describe('DeleteAccountCard', () => {
  it('should render', () => {
    const component = shallow(<DeleteAccountCard {...props} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
