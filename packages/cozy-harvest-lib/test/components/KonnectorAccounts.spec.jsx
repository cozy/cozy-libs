import React from 'react'
import { shallow } from 'enzyme'
import { KonnectorAccounts } from 'components/KonnectorAccounts'
import CozyClient from 'cozy-client'
import { fetchAccountsFromTriggers } from '../../src/connections/accounts'

jest.mock(
  'cozy-realtime',
  () =>
    function() {
      return {
        subscribe: jest.fn(),
        unsubscribe: jest.fn()
      }
    }
)
jest.mock('../../src/connections/accounts', () => ({
  fetchAccountsFromTriggers: jest.fn()
}))

describe('KonnectorAccounts', () => {
  const client = new CozyClient({})
  it('should show a spinner', () => {
    const children = jest.fn()
    const component = shallow(
      <KonnectorAccounts
        konnector={{}}
        location={{}}
        client={client}
        fetchTrigger={jest.fn()}
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
    const fetchTrigger = jest.fn()
    const component = shallow(
      <KonnectorAccounts
        konnector={{ triggers: { data: [trigger] } }}
        location={{}}
        client={client}
        fetchTrigger={fetchTrigger}
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
    await component.instance().handleTriggerUpdate({ trigger_id: 'abc' })
    await component.update()

    expect(children).toHaveBeenCalledWith([
      {
        account: { _type: 'io.cozy.accounts', _id: '123' },
        trigger: { _id: 'abc', error: 'LOGIN_FAILED' }
      }
    ])
  })
})
