import { AccountModal } from 'components/AccountModal'
import React from 'react'
import { shallow } from 'enzyme'
import { findAccount } from '../../src/connections/accounts'

jest.mock('../../src/connections/accounts', () => ({
  findAccount: jest.fn()
}))

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
  const setup = () => {
    const mockHistoryPush = jest.fn()
    const component = shallow(
      <AccountModal
        konnector={{}}
        t={x => x}
        accountId={accountIdMock}
        accounts={accountsMock}
        pushHistory={mockHistoryPush}
      />
    )
    return { component, mockHistoryPush }
  }

  it('should display the fetching state by default', () => {
    const { component } = setup()
    expect(component.getElement()).toMatchSnapshot()
  })

  describe('with an account', () => {
    findAccount.mockResolvedValue({
      _id: '123',
      name: 'account 1'
    })

    const { component, mockHistoryPush } = setup({ findAccount })

    it('should display the AccountSelect & Content if an account is there and we can change the selectedAccount', async () => {
      await component.instance().componentDidMount()

      findAccount.mockResolvedValue({
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

    it('should redirect toi the correct locations', async () => {
      await component.instance().componentDidMount()

      component.find('AccountSelectBox').prop('onChange')({
        account: { _id: '123' }
      })
      expect(mockHistoryPush).toHaveBeenCalledWith('/accounts/123')

      component.find('AccountSelectBox').prop('onCreate')()
      expect(mockHistoryPush).toHaveBeenCalledWith('/new')

      const ModalContent = component.find('ModalContent').childAt(0)
      ModalContent.prop('addAccount')()
      expect(mockHistoryPush).toHaveBeenCalledWith('/new')
    })
  })
})
