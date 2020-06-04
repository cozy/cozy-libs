/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { KonnectorModal } from 'components/KonnectorModal'
import { findAccount } from 'connections/accounts'

jest.mock('connections/accounts', () => ({
  findAccount: jest.fn()
}))

const t = key => key

beforeEach(() => {
  findAccount.mockImplementation(() => ({
    _id: '123',
    doctype: 'io.cozy.accounts'
  }))
})

describe('KonnectorModal', () => {
  let mockKonnector, props, shallowOptions

  beforeEach(() => {
    mockKonnector = {
      slug: 'mock',
      name: 'Mock',
      triggers: {
        data: [{ _id: 784, doctype: 'io.cozy.triggers' }]
      }
    }
    props = {
      dismissAction: jest.fn(),
      onSuccess: jest.fn(),
      konnector: mockKonnector,
      t
    }
    shallowOptions = {
      context: {
        client: {
          stackClient: {}
        }
      }
    }
  })

  const getMountedComponent = async extraProps => {
    const finalProps = {
      ...props,
      ...extraProps
    }
    const component = shallow(
      <KonnectorModal {...finalProps} />,
      shallowOptions
    )
    await component.instance().componentDidMount()
    component.update()
    return component
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
    findAccount.mockImplementation(() => {
      throw new Error('nope')
    })
    const component = await getMountedComponent()
    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
  })

  it('should show the configuration view of a single account', async () => {
    const component = await getMountedComponent()
    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
  })

  it('should show the list of accounts', async () => {
    mockKonnector.triggers.data = [
      { _id: '784', doctype: 'io.cozy.triggers' },
      { _id: '872', doctype: 'io.cozy.triggers' }
    ]
    const component = await getMountedComponent()

    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
  })

  it('should render the selected account via a prop', async () => {
    mockKonnector.triggers.data = [
      { _id: '784', doctype: 'io.cozy.triggers' },
      { _id: '872', doctype: 'io.cozy.triggers' }
    ]
    const component = await getMountedComponent({
      accountId: '123'
    })

    const content = component.dive().find('ModalContent')
    expect(content.getElement()).toMatchSnapshot()
  })

  describe('adding an account', () => {
    it('should call the parent when controlled by props', async () => {
      const createAction = jest.fn()
      const component = await getMountedComponent({
        createAction
      })
      component.instance().requestAccountCreation()
      expect(createAction).toHaveBeenCalled()
    })

    it('should render the form when controlled by state', async () => {
      const component = await getMountedComponent()
      component.instance().requestAccountCreation()

      const content = component.dive().find('ModalContent')
      expect(content.getElement()).toMatchSnapshot()
    })
  })

  describe('switching account', () => {
    it('should call the parent when controlled by props', async () => {
      const onAccountChange = jest.fn()
      const account = { _id: '456' }
      const trigger = { _id: 'abc' }
      const component = await getMountedComponent({
        onAccountChange
      })

      component.instance().requestAccountChange(account, trigger)
      expect(onAccountChange).toHaveBeenCalledWith(account)
    })

    it('should show the add account view when controlled by state', async () => {
      const component = await getMountedComponent()

      const account = { _id: '456' }
      const trigger = { _id: 'abc' }
      await component.instance().requestAccountChange(account, trigger)

      const content = component.dive().find('ModalContent')
      expect(content.getElement()).toMatchSnapshot()
    })
  })
})
