import React from 'react'
import { shallow } from 'enzyme'

import { DeleteAccountButton } from 'components/DeleteAccountButton'

const fixtures = {
  account: {
    _id: '61c683295560485db0f34b859197c581',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  }
}

const tMock = () => 'Mock button label'

const props = {
  t: tMock,
  deleteAccount: jest.fn()
}

describe('DeleteAccountButton', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render without listeners', () => {
    const component = shallow(
      <DeleteAccountButton account={fixtures.account} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should run deleteAccount on click', () => {
    const component = shallow(
      <DeleteAccountButton account={fixtures.account} {...props} />
    )
    component.simulate('click')
    expect(props.deleteAccount).toHaveBeenCalledWith(fixtures.account)
  })

  it('should change state on click and handle onSuccess', done => {
    const component = shallow(
      <DeleteAccountButton
        account={fixtures.account}
        onSuccess={() => done()}
        {...props}
      />
    )
    expect(component.state().deleting).toBe(false)
    component.simulate('click')
    expect(component.state().deleting).toBe(true)
  })

  it('should handle onError if provided', done => {
    const mockError = new Error('Expected logout error test')
    const deleteAccount = () => {
      throw mockError
    }
    const onError = e => {
      expect(e).toBe(mockError)
      done()
    }
    const component = shallow(
      <DeleteAccountButton
        account={fixtures.account}
        {...props}
        deleteAccount={deleteAccount}
        onError={onError}
      />
    )
    component.simulate('click')
    expect(component.state().deleting).toBe(false)
  })
})
