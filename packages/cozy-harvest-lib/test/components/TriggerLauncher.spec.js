import React, { Component } from 'react'
import { shallow } from 'enzyme'

import { TriggerLauncher } from 'components/TriggerLauncher'
import KonnectorJob from 'models/KonnectorJob'

const client = {}
const trigger = {
  _id: '65c347d1ef144288a64105702cc36e59'
}

const triggersMutationsMock = {
  fetchTrigger: jest.fn().mockResolvedValue(trigger),
  createTrigger: jest.fn().mockResolvedValue(trigger),
  createDocument: jest.fn(),
  saveDocument: jest.fn(),
  deleteDocument: jest.fn(),
  createAccount: jest.fn(),
  updateAccount: jest.fn(),
  findAccount: jest.fn(),
  deleteAccount: jest.fn(),
  saveAccount: jest.fn(),
  launchTrigger: jest.fn(),
  watchKonnectorAccount: jest.fn(),
  watchKonnectorJob: jest.fn()
}

const props = {
  client,
  trigger,
  ...triggersMutationsMock
}

class Child extends Component {}

describe('TriggerLauncher', () => {
  // Chainable mock
  const onMock = jest.fn(() => ({
    on: onMock
  }))

  beforeAll(() => {
    jest.spyOn(KonnectorJob.prototype, 'on').mockImplementation(onMock)
    jest.spyOn(KonnectorJob.prototype, 'launch').mockImplementation(() => {})
    jest.spyOn(KonnectorJob.prototype, 'unwatch').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    onMock.mockClear()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should render', () => {
    const component = shallow(
      <TriggerLauncher {...props}>{() => <Child />}</TriggerLauncher>
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should inject launch callback', () => {
    const wrapper = shallow(
      <TriggerLauncher {...props}>
        {({ launch }) => <Child launch={launch} />}
      </TriggerLauncher>
    )

    const childWrapper = wrapper.find(Child)
    const childProps = childWrapper.props()
    expect(typeof childProps.launch).toBe('function')
  })

  it('should inject running prop', () => {
    const wrapper = shallow(
      <TriggerLauncher {...props}>
        {({ running }) => <Child running={running} />}
      </TriggerLauncher>
    )

    const childWrapper = wrapper.find(Child)
    const childProps = childWrapper.props()
    expect(typeof childProps.running).toBe('boolean')
  })

  describe('launch', () => {
    it('should launch KonnectorJob', () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch }) => <Child launch={launch} />}
        </TriggerLauncher>
      )

      const childWrapper = wrapper.find(Child)
      const childProps = childWrapper.props()
      childProps.launch(trigger)
      expect(KonnectorJob.prototype.launch).toHaveBeenCalled()
    })

    it('should re-render with running being `true`', () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.update()
      const childWrapper = wrapper.find(Child)
      expect(childWrapper.props().running).toBe(true)
    })

    it('should register to KonnectorJob events', () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      let childWrapper = wrapper.find(Child)
      childWrapper.props().launch(trigger)
      expect(onMock).toHaveBeenCalledWith(
        'error',
        wrapper.instance().handleError
      )
      expect(onMock).toHaveBeenCalledWith(
        'success',
        wrapper.instance().handleSuccess
      )
      expect(onMock).toHaveBeenCalledWith(
        'twoFARequest',
        wrapper.instance().displayTwoFAModal
      )
      expect(onMock).toHaveBeenCalledWith(
        'twoFARequest',
        wrapper.instance().displayTwoFAModal
      )
    })

    it('should clear Error', () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ error, launch, running }) => (
            <Child error={error} launch={launch} running={running} />
          )}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.update()
      wrapper.instance().handleError(new Error('Test error'))
      wrapper.update()
      // Relaunch
      wrapper.instance().launch(trigger)
      wrapper.update()
      const childWrapper = wrapper.find(Child)
      expect(childWrapper.props().error).toBe(null)
    })
  })

  describe('handleError', () => {
    it('should re-render with running being `false`', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ error, launch, running }) => (
            <Child error={error} launch={launch} running={running} />
          )}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.update()
      await wrapper.instance().handleError(new Error('Test error'))
      wrapper.update()
      const childWrapper = wrapper.find(Child)
      expect(childWrapper.props().running).toBe(false)
    })

    it('should re-render with error being defined', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ error, launch, running }) => (
            <Child error={error} launch={launch} running={running} />
          )}
        </TriggerLauncher>
      )

      const error = new Error('Test error')

      wrapper.instance().launch(trigger)
      wrapper.update()
      await wrapper.instance().handleError(error)
      wrapper.update()
      const childWrapper = wrapper.find(Child)
      expect(childWrapper.props().error).toEqual(error)
    })

    it('should hide twoFA modal', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.update()
      wrapper.instance().displayTwoFAModal()
      await wrapper.instance().handleError(new Error('Test error'))
      wrapper.update()
      expect(wrapper.getElement()).toMatchSnapshot()
    })

    it('should unsubscribe from KonnectorJob', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.update()
      wrapper.instance().displayTwoFAModal()
      await wrapper.instance().handleError(new Error('Test error'))
      wrapper.update()
      expect(wrapper.getElement()).toMatchSnapshot()
    })
  })

  describe('handleSuccess', () => {
    it('should re-render with running being `false`', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.update()
      await wrapper.instance().handleSuccess()
      wrapper.update()
      const childWrapper = wrapper.find(Child)
      expect(childWrapper.props().running).toBe(false)
    })

    it('should hide twoFA modal', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.instance().displayTwoFAModal()
      await wrapper.instance().handleSuccess()
      wrapper.update()
      expect(wrapper.getElement()).toMatchSnapshot()
    })
  })

  describe('handleLoginSuccess', () => {
    it('should hide twoFA modal', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.instance().displayTwoFAModal()
      await wrapper.instance().handleLoginSuccess()
      wrapper.update()
      expect(wrapper.getElement()).toMatchSnapshot()
    })

    it('should call the onLoginSuccess callback', () => {
      const onLoginSuccess = jest.fn()
      const wrapper = shallow(
        <TriggerLauncher {...props} onLoginSuccess={onLoginSuccess}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().launch(trigger)
      wrapper.instance().handleLoginSuccess()
      expect(onLoginSuccess).toHaveBeenCalled()
    })
  })

  describe('handleTwoFA', () => {
    it('should display Two FA modal', () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      wrapper.instance().displayTwoFAModal()
      expect(wrapper.getElement()).toMatchSnapshot()
    })
  })
})
