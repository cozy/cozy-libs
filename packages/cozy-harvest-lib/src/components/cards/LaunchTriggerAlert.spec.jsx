import { render, waitFor, fireEvent } from '@testing-library/react'
import React from 'react'

import flag from 'cozy-flags'

import { LaunchTriggerAlert } from './LaunchTriggerAlert'
import AppLike from '../../../test/AppLike'
import ConnectionFlow from '../../models/ConnectionFlow'
import OpenOAuthWindowButton from '../AccountModalWithoutTabs/OpenOAuthWindowButton'

jest.mock('../AccountModalWithoutTabs/OpenOAuthWindowButton')

jest.mock('../../models/ConnectionFlow', () => {
  // Require the original module to not be mocked...
  const { default: mockConnectionFlow } = jest.requireActual(
    '../../models/ConnectionFlow'
  )

  mockConnectionFlow.prototype.watchJob = jest.fn()

  return mockConnectionFlow
})

jest.mock('cozy-flags')

const triggerFixture = {
  _id: 'd861818b62204988bf0bb78c182a9149',
  arguments: '0 0 0 * * 0'
}

const konnectorFixture = {
  slug: 'testslug'
}

const cliskKonnectorFixture = {
  slug: 'testslug',
  clientSide: true
}

const powensKonnectorFixture = {
  slug: 'powenstestslug',
  partnership: {
    domain: 'budget-insight.com'
  }
}

const erroredTriggerFixture = {
  id: 'errored-trigger-id',
  current_state: {
    status: 'errored',
    last_error: 'random error message'
  },
  arguments: '0 0 0 * * 0'
}

const reconnectErrorTriggerFixture = {
  id: 'reconnect-errored-trigger-id',
  current_state: {
    status: 'errored',
    last_error: 'LOGIN_FAILED'
  },
  arguments: '0 0 0 * * 0'
}

describe('LaunchTriggerAlert', () => {
  const setup = ({ trigger, konnector }) => {
    const client = {
      collection: () => {
        return {
          get: jest.fn().mockResolvedValue({ data: trigger })
        }
      },
      plugins: {
        realtime: {
          sendNotification: jest.fn(),
          subscribe: jest.fn()
        }
      }
    }

    const flow = new ConnectionFlow(client, trigger, konnector)
    flow.launch = jest.fn()
    const historyAction = jest.fn()
    const root = render(
      <AppLike client={client}>
        <LaunchTriggerAlert
          t={key => key}
          flow={flow}
          historyAction={historyAction}
          account={{}}
        />
      </AppLike>
    )
    return { root, flow, historyAction, client }
  }
  // eslint-disable-next-line no-console
  let originalConsoleWarn = console.warn

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    // FIXME used this dirty fix to avoid blocking a delivery for this message : The ActionMenu component has been deprecated and should be replaced by ActionsMenu. More infos: https://docs.cozy.io/cozy-ui/react/#!/ActionsMenu
    // eslint-disable-next-line no-console
    console.warn = message => console.log('warning: ' + message)
  })
  afterEach(() => {
    // eslint-disable-next-line no-console
    console.warn = originalConsoleWarn
  })

  it('should just launch konnector when there is no error', async () => {
    const { root, flow } = setup({
      trigger: triggerFixture,
      konnector: konnectorFixture
    })
    await waitFor(() => root.getByTestId('alert-menu-button'))
    fireEvent.click(root.getByTestId('alert-menu-button'))
    const buttons = root.getAllByText('card.launchTrigger.button.label')
    expect(buttons.length).toBe(2)
    for (const button of buttons) {
      fireEvent.click(button)
    }
    expect(flow.launch).toHaveBeenCalledTimes(2)
  })

  it('should launch konnector when there is an error which is not solvable via reconnect', async () => {
    const { root, flow } = setup({
      trigger: erroredTriggerFixture,
      konnector: konnectorFixture
    })
    await waitFor(() => root.getByTestId('alert-menu-button'))
    fireEvent.click(root.getByTestId('alert-menu-button'))
    const buttons = root.getAllByText('card.launchTrigger.button.label')
    expect(buttons.length).toBe(2)
    for (const button of buttons) {
      fireEvent.click(button)
    }
    expect(flow.launch).toHaveBeenCalledTimes(2)
  })

  it('should redirect when there is an error which is solvable via reconnect', async () => {
    const { root, flow, historyAction } = setup({
      trigger: reconnectErrorTriggerFixture,
      konnector: konnectorFixture
    })
    await waitFor(() => root.getByText('card.launchTrigger.button.label'))
    fireEvent.click(root.getByText('card.launchTrigger.button.label'))
    expect(historyAction).toHaveBeenCalledWith('/edit', 'push')
    expect(flow.launch).not.toHaveBeenCalled()
  })

  it('should show OpenOAuthWindowButton when there is an error which is solvable via reconnect with a powens konnector', async () => {
    flag.mockImplementation(key =>
      key === 'harvest.bi.webview' ? true : false
    )
    OpenOAuthWindowButton.mockImplementation(() => (
      <>
        <div>OpenOAuthWindowButton</div>
      </>
    ))
    const { root } = setup({
      trigger: reconnectErrorTriggerFixture,
      konnector: powensKonnectorFixture
    })
    await waitFor(() => root.getByTestId('alert-menu-button'))
    expect(OpenOAuthWindowButton).toHaveBeenCalled()
  })

  it('should launch when there is an error which is solvable via reconnect but with a clisk konnector', async () => {
    window.cozy = {
      ClientKonnectorLauncher: 'react-native'
    }
    const { root, flow } = setup({
      trigger: reconnectErrorTriggerFixture,
      konnector: cliskKonnectorFixture
    })
    await waitFor(() => root.getByTestId('alert-menu-button'))
    fireEvent.click(root.getByTestId('alert-menu-button'))
    const buttons = root.getAllByText('card.launchTrigger.button.label')
    expect(buttons.length).toBe(2)
    for (const button of buttons) {
      fireEvent.click(button)
    }
    expect(flow.launch).toHaveBeenCalledTimes(2)
  })
})
