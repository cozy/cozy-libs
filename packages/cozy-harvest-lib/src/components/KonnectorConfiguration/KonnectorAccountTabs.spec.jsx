import React from 'react'
import { render } from '@testing-library/react'
import AppLike from '../../../test/AppLike'
import KonnectorAccountTabs, {
  KonnectorAccountTabsTabs
} from './KonnectorAccountTabs'
import useMaintenanceStatus from 'components/hooks/useMaintenanceStatus'

jest.mock('components/hooks/useMaintenanceStatus')
jest.mock(
  'components/KonnectorConfiguration/ConfigurationTab',
  () => () => null
)
jest.mock('components/infos/TriggerErrorInfo', () => ({ action }) => (
  <>
    <div>Login error</div>
    {action}
  </>
))
jest.mock('components/RedirectToAccountFormButton', () => () => (
  <button>Reconnect</button>
))
jest.mock('../hooks/useOAuthExtraParams', () => ({ konnector }) => {
  const needsExtraParams =
    konnector?.partnership?.domain === 'budget-insight.com'

  return {
    fetchStatus: 'loaded',
    needsExtraParams,
    extraParams: needsExtraParams ? {} : null
  }
})

const accountFixture = {
  _id: '123account'
}

describe('Konnector account tabs header', () => {
  const setup = () => {
    const flowState = {
      running: false,
      error: {
        isLoginError: () => true
      }
    }

    const root = render(
      <AppLike client={{}}>
        <KonnectorAccountTabsTabs
          flowState={flowState}
          onChange={jest.fn()}
          tab={0}
        />
      </AppLike>
    )
    return { root }
  }

  it('should display the right content', () => {
    const { root } = setup()
    expect(root.getByText('Data')).toBeTruthy()
    expect(root.getByText('Configuration')).toBeTruthy()
  })
})

describe('Konnector account tabs content', () => {
  const setup = async ({
    isError = false,
    isInMaintenance = false,
    initialActiveTab = 'data',
    isBIWebViewKonnector = false
  } = {}) => {
    useMaintenanceStatus.mockReturnValue({
      data: { isInMaintenance, message: '' }
    })

    const trigger = {
      arguments: '* * * * * *',
      ...(isError
        ? { current_state: { status: 'errored', last_error: 'LOGIN_FAILED' } }
        : {})
    }
    const konnector = isBIWebViewKonnector
      ? { partnership: { domain: 'budget-insight.com' } }
      : {}

    const root = await render(
      <AppLike>
        <KonnectorAccountTabs
          konnector={konnector}
          initialTrigger={trigger}
          account={accountFixture}
          onAccountDeleted={() => {}}
          addAccount={() => {}}
          initialActiveTab={initialActiveTab}
          intentsApi={{}}
          innerAccountModalOverrides={{}}
        />
      </AppLike>
    )
    return { root }
  }

  it('should show error info if konnector is not in maintenance', async () => {
    const { root } = await setup({ isError: true, isInMaintenance: false })
    await expect(root.getByText('Login error')).toBeInTheDocument()
  })

  it('should not show error info if konnector is in maintenance', async () => {
    const { root } = await setup({ isError: true, isInMaintenance: true })
    await expect(root.queryByText('Login error')).not.toBeInTheDocument()
  })

  it('should show error info on data tab', async () => {
    const { root } = await setup({ isError: true, initialActiveTab: 'data' })
    await expect(root.getByText('Login error')).toBeInTheDocument()
  })

  it('should show error info on configuration tab', async () => {
    const { root } = await setup({
      isError: true,
      initialActiveTab: 'configuration'
    })
    await expect(root.getByText('Login error')).toBeInTheDocument()
  })

  describe('for a konnector using a Cozy form', () => {
    it('should show a reconnect button if error is solvable by reconnecting through form', async () => {
      const { root } = await setup({ isError: true, isInMaintenance: false })
      expect(root.getByText('Reconnect')).toBeInTheDocument()
    })
  })

  describe('for a konnector using BI webviews', () => {
    it('should show a reconnect button if error is solvable by reconnecting through BI webview', async () => {
      const { root } = await setup({
        isError: true,
        isInMaintenance: false,
        isBIWebViewKonnector: true
      })
      expect(root.getByText('Reconnect')).toBeInTheDocument()
    })
  })
})
