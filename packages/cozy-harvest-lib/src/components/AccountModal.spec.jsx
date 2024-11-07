import { AccountModal } from 'components/AccountModal'
import { shallow } from 'enzyme'
import React from 'react'

import { fetchAccount } from '../../src/connections/accounts'

jest.mock('../../src/connections/accounts', () => ({
  fetchAccount: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => () => ({
  isMobile: false
}))

const accountsAndTriggersMock = [
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
  const setup = () => {
    const component = shallow(
      <AccountModal
        konnector={{}}
        t={x => x}
        accountId={accountIdMock}
        accountsAndTriggers={accountsAndTriggersMock}
        navigate={() => {}}
        breakpoints={{ isMobile: true }}
        onDismiss={jest.fn()}
      />
    )
    return { component }
  }

  it('should display the fetching state by default', () => {
    const { component } = setup()
    expect(component.getElement()).toMatchSnapshot()
  })

  describe('with an account', () => {
    fetchAccount.mockResolvedValue({
      _id: '123',
      name: 'account 1'
    })

    const { component } = setup({ fetchAccount })

    it('should display the AccountSelect & Content if an account is there and we can change the selectedAccount', async () => {
      await component.instance().componentDidMount()

      fetchAccount.mockResolvedValue({
        _id: 'account_2',
        name: 'account_2'
      })

      expect(component.getElement()).toMatchSnapshot()
      component.setProps({
        accountId: 'account_2'
      })

      await component
        .instance()
        .componentDidUpdate({ accountId: accountIdMock })
      expect(component.getElement()).toMatchSnapshot()
    })
  })
})
