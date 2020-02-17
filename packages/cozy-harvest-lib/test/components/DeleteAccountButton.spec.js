import React from 'react'
import { shallow } from 'enzyme'

import { DeleteAccountButton } from 'components/DeleteAccountButton'
import { deleteAccount } from '../../src/connections/accounts'

jest.mock('../../src/connections/accounts', () => ({
  deleteAccount: jest.fn()
}))

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
  t: tMock
}

describe('DeleteAccountButton', () => {
  const client = {}
  beforeEach(() => {
    deleteAccount.mockReset()
  })

  it('should render without listeners', () => {
    const component = shallow(
      <DeleteAccountButton
        client={client}
        account={fixtures.account}
        {...props}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should run deleteAccount on click', () => {
    const component = shallow(
      <DeleteAccountButton
        client={client}
        account={fixtures.account}
        {...props}
      />
    )
    component.simulate('click')
    expect(deleteAccount).toHaveBeenCalledWith(client, fixtures.account)
  })

  it('should change state on click and handle onSuccess', done => {
    const component = shallow(
      <DeleteAccountButton
        client={client}
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
    deleteAccount.mockImplementation(() => {
      throw mockError
    })
    const onError = e => {
      expect(e).toBe(mockError)
      done()
    }
    const component = shallow(
      <DeleteAccountButton
        client={client}
        account={fixtures.account}
        {...props}
        onError={onError}
      />
    )
    component.simulate('click')
    expect(component.state().deleting).toBe(false)
  })
})
