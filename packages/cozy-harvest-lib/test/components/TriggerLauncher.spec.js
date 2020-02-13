import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { TriggerLauncher } from 'components/TriggerLauncher'
import {
  SUCCESS_EVENT,
  LOGIN_SUCCESS_EVENT,
  TWO_FA_REQUEST_EVENT
} from 'models/ConnectionFlow'
import TwoFAModal from 'components/TwoFAModal'

const client = {
  on: jest.fn(),
  stackClient: {
    uri: 'https://cozy.tools:8080'
  }
}
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

  describe('handleSuccess', () => {
    it('should hide twoFA modal', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      const flow = wrapper.instance().flow

      flow.triggerEvent(TWO_FA_REQUEST_EVENT)
      wrapper.update()
      expect(wrapper.find(TwoFAModal).length).toBe(1)
      flow.triggerEvent(SUCCESS_EVENT)
      wrapper.update()
      expect(wrapper.find(TwoFAModal).length).toBe(0)
    })
  })

  describe('handleLoginSuccess', () => {
    it('should show/hide twoFA modal', async () => {
      const wrapper = shallow(
        <TriggerLauncher {...props}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )

      const flow = wrapper.instance().flow
      flow.triggerEvent(TWO_FA_REQUEST_EVENT)
      wrapper.update()
      expect(wrapper.find(TwoFAModal).length).toBe(1)
      flow.triggerEvent(LOGIN_SUCCESS_EVENT)
      wrapper.update()
      expect(wrapper.find(TwoFAModal).length).toBe(0)
    })

    it('should call the onLoginSuccess callback', () => {
      const onLoginSuccess = jest.fn()
      const wrapper = shallow(
        <TriggerLauncher {...props} onLoginSuccess={onLoginSuccess}>
          {({ launch, running }) => <Child launch={launch} running={running} />}
        </TriggerLauncher>
      )
      const flow = wrapper.instance().flow
      flow.triggerEvent(LOGIN_SUCCESS_EVENT)
      expect(onLoginSuccess).toHaveBeenCalled()
    })
  })
})
