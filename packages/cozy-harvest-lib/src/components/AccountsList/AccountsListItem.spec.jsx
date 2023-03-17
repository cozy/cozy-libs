import AccountsListItem from 'components/AccountsList/AccountsListItem'
import { shallow } from 'enzyme'
import React from 'react'

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
        trigger={{}}
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
        trigger={{}}
      />
    )
    const component = wrapper.shallow()
    expect(component.getElement()).toMatchSnapshot()
  })
})
