import { AccountModal } from 'components/AccountModal'
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

  describe('with an account', () => {
    const findAccount = jest.fn().mockResolvedValue({
      _id: '123',
      name: 'account 1'
    })
    const mockHistory = {
      push: jest.fn()
    }
    const component = shallow(
      <AccountModal
        accountId={accountIdMock}
        accounts={accountsMock}
        findAccount={findAccount}
        history={mockHistory}
      />
    )

    it('should display the AccountSelect & Content if an account is there and we can change the selectedAccount', async () => {
      await component.instance().componentDidMount()
      expect(component.getElement()).toMatchSnapshot()
      component.setProps({
        accountId: 'account_2',
        findAccount: jest.fn().mockResolvedValue({
          _id: 'account_2',
          name: 'account_2'
        })
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
      expect(mockHistory.push).toHaveBeenCalledWith('../123')

      component.find('AccountSelectBox').prop('onCreate')()
      expect(mockHistory.push).toHaveBeenCalledWith('../../new')

      const ModalContent = component.find('ModalContent').find('Wrapper')
      ModalContent.prop('addAccount')()
      expect(mockHistory.push).toHaveBeenCalledWith('../../new')
    })
  })
})
