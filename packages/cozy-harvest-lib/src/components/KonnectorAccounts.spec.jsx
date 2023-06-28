import { KonnectorAccounts } from 'components/KonnectorAccounts'
import { shallow } from 'enzyme'
import React from 'react'

import CozyClient from 'cozy-client'

import { fetchAccountsFromTriggers } from '../../src/connections/accounts'
import { fetchTrigger } from '../../src/connections/triggers'

jest.mock(
  'cozy-realtime',
  () =>
    function () {
      return {
        subscribe: jest.fn(),
        unsubscribe: jest.fn()
      }
    }
)
jest.mock('../../src/connections/accounts', () => ({
  fetchAccountsFromTriggers: jest.fn()
}))

jest.mock('../../src/connections/triggers', () => ({
  fetchTrigger: jest.fn()
}))

describe('KonnectorAccounts', () => {
  const client = new CozyClient({})
  client.plugins.realtime = {
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  }
  it('should show a spinner', () => {
    const children = jest.fn()
    const component = shallow(
      <KonnectorAccounts
        konnector={{}}
        location={{}}
        client={client}
        t={jest.fn()}
      >
        {children}
      </KonnectorAccounts>
    )

    expect(component.getElement()).toMatchSnapshot()
    expect(children).not.toHaveBeenCalled()
  })

  it('should call children with the accounts and triggers list', async () => {
    const children = jest.fn()
    const trigger = { _id: 'abc', error: null }
    fetchAccountsFromTriggers.mockResolvedValueOnce([
      {
        account: { _type: 'io.cozy.accounts', _id: '123' },
        trigger
      }
    ])
    const component = shallow(
      <KonnectorAccounts
        konnector={{ triggers: { data: [trigger] } }}
        location={{}}
        client={client}
        t={jest.fn()}
      >
        {children}
      </KonnectorAccounts>
    )
    await component.instance().fetchAccounts()
    await component.update()

    expect(children).toHaveBeenCalledWith([
      {
        account: { _type: 'io.cozy.accounts', _id: '123' },
        trigger: { _id: 'abc', error: null }
      }
    ])

    fetchTrigger.mockResolvedValueOnce({
      _id: 'abc',
      error: 'LOGIN_FAILED'
    })
    await component.instance().handleJobUpdate({ trigger_id: 'abc' })
    await component.update()

    expect(children).toHaveBeenCalledWith([
      {
        account: { _type: 'io.cozy.accounts', _id: '123' },
        trigger: { _id: 'abc', error: 'LOGIN_FAILED' }
      }
    ])
  })
})
