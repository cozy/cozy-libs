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
    createAction: jest.fn(),
    onSuccess: jest.fn(),
    konnector: mockKonnector,
    t
  }
  const shallowOptions = {
    context: {
      client: {}
    }
  }

  it('should show a spinner while loading', () => {
    const component = shallow(<KonnectorModal {...props} />, shallowOptions)

    const spinner = component
      .dive()
      .find('ModalContent')
      .childAt(0)
      .dive()
    expect(spinner.getElement()).toMatchSnapshot()
  })

  it('should show the content', () => {
    const component = shallow(<KonnectorModal {...props} />, shallowOptions)
    component.setState({ fetching: false })

    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
  })

  it('should pass trigger if konnector has triggers', async () => {
    const component = await shallow(
      <KonnectorModal {...props} />,
      shallowOptions
    )
    const manager = component.find(TriggerManager)
    expect(manager.props().trigger).toBeDefined()
  })
})
