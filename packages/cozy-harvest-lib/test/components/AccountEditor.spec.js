/* eslint-env jest */
import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AccountEditor } from 'components/AccountEditor'

configure({ adapter: new Adapter() })

const onBeforeUpdateSpy = jest.fn()
const onUpdateSuccessSpy = jest.fn()

const updateAccountMock = jest.fn()

const fixtures = {
  account: {
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    }
  },
  konnector: {
    slug: 'konnectest'
  },
  data: {
    username: 'foo',
    passphrase: 'fuz'
  },
  expectedUpdatedAccount: {
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'fuz'
    }
  }
}

describe('AccountEditor', () => {
  it('should render', () => {
    const component = shallow(
      <AccountEditor
        account={fixtures.account}
        konnector={fixtures.konnector}
        onBeforeUpdate={onBeforeUpdateSpy}
        onUpdateSuccess={onUpdateSuccessSpy}
        updateAccount={updateAccountMock}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  describe('update', () => {
    beforeEach(() => {
      updateAccountMock.mockResolvedValue(fixtures.expectedUpdatedAccount)
    })

    afterEach(() => {
      updateAccountMock.mockReset()
      onBeforeUpdateSpy.mockClear()
      onUpdateSuccessSpy.mockClear()
    })

    it('should call onUpdate', () => {
      const wrapper = shallow(
        <AccountEditor
          account={fixtures.account}
          konnector={fixtures.konnector}
          onBeforeUpdate={onBeforeUpdateSpy}
          onUpdateSuccess={onUpdateSuccessSpy}
          updateAccount={updateAccountMock}
        />
      )
      wrapper.instance().handleSubmit(fixtures.data)
      expect(onBeforeUpdateSpy).toHaveBeenCalledTimes(1)
      expect(onBeforeUpdateSpy).toHaveBeenCalledWith(fixtures.account)
    })

    it('should call onUpdateSuccess', async () => {
      const wrapper = shallow(
        <AccountEditor
          account={fixtures.account}
          konnector={fixtures.konnector}
          onBeforeUpdate={onBeforeUpdateSpy}
          onUpdateSuccess={onUpdateSuccessSpy}
          updateAccount={updateAccountMock}
        />
      )
      await wrapper.instance().handleSubmit(fixtures.data)
      expect(onUpdateSuccessSpy).toHaveBeenCalledTimes(1)
      expect(onUpdateSuccessSpy).toHaveBeenCalledWith(
        fixtures.expectedUpdatedAccount
      )
    })
  })
})
