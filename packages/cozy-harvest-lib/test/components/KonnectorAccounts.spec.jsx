import React from 'react'
import { shallow } from 'enzyme'
import { KonnectorAccounts } from 'components/KonnectorAccounts'

describe('KonnectorAccounts', () => {
  const mockClient = {
    on: jest.fn(),
    stackClient: { uri: 'http://coy.tools:8080' }
  }

  it('should show a spinner', () => {
    const children = jest.fn()
    const component = shallow(
      <KonnectorAccounts
        konnector={{}}
        location={{}}
        client={mockClient}
        findAccount={jest.fn()}
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
    const findAccount = jest
      .fn()
      .mockResolvedValueOnce({ _type: 'io.cozy.accounts', _id: '123' })
    const fetchTrigger = jest.fn()
    const component = shallow(
      <KonnectorAccounts
        konnector={{ triggers: { data: [{ _id: 'abc', error: null }] } }}
        location={{}}
        client={mockClient}
        findAccount={findAccount}
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
