import React from 'react'
import { shallow } from 'enzyme'

import AccountsListItem from 'components/AccountsList/AccountsListItem'

describe('AccountsListItem', () => {
  it('should not render the caption since accountLogin is undefined', () => {
    const wrapper = shallow(
      <AccountsListItem
        account={{
          _id: 'account-1'
        }}
        konnector={{
          name: 'test-konnector',
          vendor_link: 'test konnector link'
        }}
        onClick={jest.fn()}
        trigger={jest.fn()}
      />
    )
    const component = wrapper.shallow()
    expect(component.getElement()).toMatchSnapshot()
  })

  it('should render the caption since accountName !== login', () => {
    const wrapper = shallow(
      <AccountsListItem
        account={{
          _id: 'account-1',
          auth: { login: 'mylogin', accountName: 'myAccountName' }
        }}
        konnector={{
          name: 'test-konnector',
          vendor_link: 'test konnector link'
        }}
        onClick={jest.fn()}
        trigger={jest.fn()}
      />
    )
    const component = wrapper.shallow()
    expect(component.getElement()).toMatchSnapshot()
  })
})
