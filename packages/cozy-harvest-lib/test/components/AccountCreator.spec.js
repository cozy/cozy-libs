/* eslint-env jest */
import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AccountCreator } from 'components/AccountCreator'

configure({ adapter: new Adapter() })

const onCreateSpy = jest.fn()
const onCreateSuccessSpy = jest.fn()

const createAccountMock = jest.fn()

const fixtures = {
  konnector: {
    slug: 'konnectest'
  },
  data: {
    username: 'foo',
    passphrase: 'bar'
  },
  expectedAccount: {
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    }
  }
}

describe('AccountCreator', () => {
  it('should render', () => {
    const component = shallow(
      <AccountCreator
        createAccount={createAccountMock}
        konnector={fixtures.konnector}
        onBeforeCreate={onCreateSpy}
        onCreateSuccess={onCreateSuccessSpy}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  describe('handleSubmit', () => {
    beforeEach(() => {
      createAccountMock.mockResolvedValue(fixtures.expectedAccount)
    })

    afterEach(() => {
      createAccountMock.mockReset()
      onCreateSpy.mockClear()
      onCreateSuccessSpy.mockClear()
    })

    it('should call onCreate', () => {
      const wrapper = shallow(
        <AccountCreator
          createAccount={createAccountMock}
          konnector={fixtures.konnector}
          onBeforeCreate={onCreateSpy}
          onCreateSuccess={onCreateSuccessSpy}
        />
      )
      wrapper.instance().handleSubmit(fixtures.data)
      expect(onCreateSpy).toHaveBeenCalledTimes(1)
    })

    it('should call onCreateSuccess', async () => {
      const wrapper = shallow(
        <AccountCreator
          createAccount={createAccountMock}
          konnector={fixtures.konnector}
          onBeforeCreate={onCreateSpy}
          onCreateSuccess={onCreateSuccessSpy}
        />
      )
      await wrapper.instance().handleSubmit(fixtures.data)
      expect(onCreateSuccessSpy).toHaveBeenCalledTimes(1)
      expect(onCreateSuccessSpy).toHaveBeenCalledWith(fixtures.expectedAccount)
    })
  })
})
