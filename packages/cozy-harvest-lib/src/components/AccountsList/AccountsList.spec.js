import React from 'react'
import { shallow } from 'enzyme'

import { AccountsList } from 'components/AccountsList/AccountsList'

describe('AccountsList', () => {
  it('should render', () => {
    const wrapper = shallow(
      <AccountsList
        accounts={[
          {
            account: { _id: 'account-1' },
            trigger: { _id: 'trigger-1' }
          },
          {
            account: { _id: 'account-2' },
            trigger: { _id: 'trigger-2' }
          }
        ]}
        konnector={{
          name: 'test-konnector',
          vendor_link: 'test konnector link'
        }}
        addAccount={jest.fn()}
        onPick={jest.fn()}
        t={jest.fn(str => str)}
      />
    )
    const component = wrapper.shallow()
    expect(component.getElement()).toMatchSnapshot()
  })
})
