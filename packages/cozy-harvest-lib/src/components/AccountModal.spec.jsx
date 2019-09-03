import { AccountModal } from './AccountModal'
import React from 'react'
import { shallow } from 'enzyme'
const accountsMock = [
  {
    account: {
      _id: '123',
      name: 'account 1'
    },
    trigger: {
      id: 'triggerid',
      current_state: {}
    }
  },
  {
    account: {
      _id: 'account_2',
      name: 'account_2'
    },
    trigger: {
      id: 'trigger_account2'
    }
  }
]
const accountIdMock = '123'

describe('AccountModal', () => {
  it('should display the fetching state by default', () => {
    const component = shallow(<AccountModal />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should display the AccountSelect & Content if an account is there and we can change the selectedAccount', async () => {
    const findAccount = jest.fn().mockResolvedValue({
      _id: '123',
      name: 'account 1'
    })
    const component = shallow(
      <AccountModal
        accountId={accountIdMock}
        accounts={accountsMock}
        findAccount={findAccount}
      />
    )
    await component.instance().componentDidMount()
    expect(component.getElement()).toMatchSnapshot()
    component.setProps({
      accountId: 'account_2',
      findAccount: jest.fn().mockResolvedValue({
        _id: 'account_2',
        name: 'account_2'
      })
    })

    await component.instance().componentDidUpdate({ accountId: accountIdMock })
    expect(component.getElement()).toMatchSnapshot()
  })

  
})
