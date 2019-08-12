/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { KonnectorModal } from 'components/KonnectorModal'
import TriggerManager from 'components/TriggerManager'

const t = key => key

const findAccountMock = jest.fn().mockImplementation(() => ({
  _id: '123',
  doctype: 'io.cozy.accounts'
}))

describe('KonnectorModal', () => {
  const mockKonnector = {
    slug: 'mock',
    name: 'Mock',
    triggers: {
      data: [{ _id: 784, doctype: 'io.cozy.triggers' }]
    }
  }
  const props = {
    findAccount: findAccountMock,
    dismissAction: jest.fn(),
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

  it('should show an error view', async () => {
    const failingProps = {
      ...props,
      findAccount: () => {
        throw new Error('nope')
      }
    }
    const component = shallow(
      <KonnectorModal {...failingProps} />,
      shallowOptions
    )
    await component.instance().componentDidMount()
    component.update()

    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
  })

  it('should show the configuration view of a single account', async () => {
    const component = shallow(<KonnectorModal {...props} />, shallowOptions)
    await component.instance().componentDidMount()
    component.update()

    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
  })

  it('should show the list of accounts', async () => {
    const dataBackup = mockKonnector.triggers.data
    mockKonnector.triggers.data = [
      { _id: '784', doctype: 'io.cozy.triggers' },
      { _id: '872', doctype: 'io.cozy.triggers' }
    ]
    const component = shallow(<KonnectorModal {...props} />, shallowOptions)
    await component.instance().componentDidMount()
    component.update()

    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
    mockKonnector.triggers.data = dataBackup
  })

  describe('adding an account', () => {
    it('should call the parent when controlled by props', () => {
      const createAction = jest.fn()
      const propsWithCreation = {
        ...props,
        createAction
      }
      const component = shallow(
        <KonnectorModal {...propsWithCreation} />,
        shallowOptions
      )
      component.instance().requestAccountCreation()
      expect(createAction).toHaveBeenCalled()
    })

    it('should render the form when controlled by state', async () => {
      const component = shallow(<KonnectorModal {...props} />, shallowOptions)
      await component.instance().componentDidMount()
      component.instance().requestAccountCreation()

      const content = component.dive().find('ModalContent')
      expect(content.getElement()).toMatchSnapshot()
    })
  })

  xit('should pass trigger if konnector has triggers', async () => {
    const component = await shallow(
      <KonnectorModal {...props} />,
      shallowOptions
    )
    const manager = component.find(TriggerManager)
    expect(manager.props().trigger).toBeDefined()
  })
})
