/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { KonnectorModal } from 'components/KonnectorModal'
import TriggerManager from 'components/TriggerManager'

const t = key => key

const findAccountMock = jest.fn().mockImplementation(() => ({
  id: 123,
  doctype: 'io.cozy.accounts'
}))

describe('KonnectorModal', () => {
  it('should pass trigger if konnector has triggers', async () => {
    const mockKonnector = {
      slug: 'mock',
      name: 'Mock',
      triggers: {
        data: [{ id: 784, doctype: 'io.cozy.triggers' }]
      }
    }
    const props = {
      findAccount: findAccountMock,
      dismissAction: jest.fn(),
      onSuccess: jest.fn(),
      konnector: mockKonnector,
      t
    }
    const component = await shallow(<KonnectorModal {...props} />)
    const manager = component.find(TriggerManager)
    expect(manager.props().trigger).toBeDefined()
  })
})
