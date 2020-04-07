import React from 'react'
import { shallow } from 'enzyme'
import { FlowProvider } from 'components/FlowProvider'
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
  _id: 'trigger-id'
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
  initialTrigger: trigger,
  konnector: {
    slug: 'konnectorslug'
  },
  ...triggersMutationsMock
}

describe('FlowProvider', () => {
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

  it('should pass the konnector to the flow', () => {
    const children = jest.fn()
    const wrapper = shallow(<FlowProvider {...props}>{children}</FlowProvider>)
    const flow = wrapper.instance().flow
    expect(flow.konnector).toEqual(props.konnector)
  })

  it('should support a flow with a SUCCESS', () => {
    const children = jest.fn()
    const wrapper = shallow(<FlowProvider {...props}>{children}</FlowProvider>)

    const flow = wrapper.instance().flow
    expect(children.mock.calls[0][0].flow.getState().status).toEqual('IDLE')

    flow.triggerEvent(TWO_FA_REQUEST_EVENT)
    wrapper.update()
    expect(wrapper.find(TwoFAModal).length).toBe(1)

    flow.triggerEvent(SUCCESS_EVENT)
    wrapper.update()
    expect(wrapper.find(TwoFAModal).length).toBe(0)
    expect(children.mock.calls[2][0].flow.getState().status).toEqual('SUCCESS')
  })

  it('should support a flow with a LOGIN_SUCCESS', () => {
    const children = jest.fn()
    const wrapper = shallow(<FlowProvider {...props}>{children}</FlowProvider>)

    const flow = wrapper.instance().flow

    flow.triggerEvent(TWO_FA_REQUEST_EVENT)
    wrapper.update()
    expect(wrapper.find(TwoFAModal).length).toBe(1)

    flow.triggerEvent(LOGIN_SUCCESS_EVENT)
    wrapper.update()
    expect(wrapper.find(TwoFAModal).length).toBe(0)
    expect(children.mock.calls[2][0].flow.getState().status).toEqual(
      'LOGIN_SUCCESS'
    )
  })

  it('should call the onLoginSuccess callback', () => {
    const onLoginSuccess = jest.fn()
    const wrapper = shallow(
      <FlowProvider {...props} onLoginSuccess={onLoginSuccess}>
        {jest.fn()}
      </FlowProvider>
    )
    const flow = wrapper.instance().flow
    flow.account = {
      _id: 'account-id'
    }
    flow.triggerEvent(LOGIN_SUCCESS_EVENT)
    expect(onLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        message: {
          account: 'account-id'
        }
      })
    )
  })

  it('should detect an error in the initial trigger', () => {
    const children = jest.fn()
    const triggerWithExistingError = {
      ...trigger,
      current_state: { status: 'errored', last_error: 'Login failed' }
    }
    shallow(
      <FlowProvider {...props} initialTrigger={triggerWithExistingError}>
        {children}
      </FlowProvider>
    )

    expect(children.mock.calls[0][0].flow.getState().error).not.toBe(null)
  })
})
