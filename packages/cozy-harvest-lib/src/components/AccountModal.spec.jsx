import { AccountModal } from 'components/AccountModal'
import { shallow } from 'enzyme'
import React from 'react'

import { fetchAccount } from '../../src/connections/accounts'

jest.mock('../../src/connections/accounts', () => ({
  fetchAccount: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/hooks/useBreakpoints', () => () => ({
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
    const mockHistoryPush = jest.fn()
    const mockHistoryReplace = jest.fn()

    const component = shallow(
      <AccountModal
        konnector={{}}
        t={x => x}
        accountId={accountIdMock}
        accountsAndTriggers={accountsAndTriggersMock}
        pushHistory={mockHistoryPush}
        replaceHistory={mockHistoryReplace}
        breakpoints={{ isMobile: true }}
        onDismiss={jest.fn()}
      />
    )
    return { component, mockHistoryPush, mockHistoryReplace }
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

    const { component, mockHistoryPush } = setup({
      fetchAccount
    })

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

    it('should redirect to the correct locations', async () => {
      await component.instance().componentDidMount()

      component.find('AccountSelectBox').prop('onChange')({
        account: { _id: '123' }
      })
      expect(mockHistoryPush).toHaveBeenCalledWith('/accounts/123')

      component.find('AccountSelectBox').prop('onCreate')()
      expect(mockHistoryPush).toHaveBeenCalledWith('/new')

      const accountTabs = component.find('KonnectorAccountWrapper')
      accountTabs.prop('addAccount')()
      expect(mockHistoryPush).toHaveBeenCalledWith('/new')
    })
  })
})
