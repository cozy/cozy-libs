/* eslint-env jest */
import { act, render } from '@testing-library/react'
import { OAuthForm } from 'components/OAuthForm'
import React from 'react'

import CozyClient from 'cozy-client'

import AppLike from '../../test/AppLike'
import { KonnectorJobError } from '../helpers/konnectors'
import { findKonnectorPolicy } from '../konnector-policies'
import ConnectionFlow from '../models/ConnectionFlow'

const fetchExtraOAuthUrlParams = jest.fn().mockResolvedValue({})
jest.mock('../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))
findKonnectorPolicy.mockReturnValue({
  fetchExtraOAuthUrlParams: fetchExtraOAuthUrlParams
})

const t = jest.fn().mockImplementation(key => key)

window.open = jest.fn().mockReturnValue({
  focus: jest.fn(),
  close: jest.fn()
})

const fixtures = {
  account: { _id: '123', oauth: { access_token: '1234abcd' } },
  konnector: {
    slug: 'test-konnector'
  }
}

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}))

describe('OAuthForm', () => {
  const setup = async ({
    account = null,
    flowState = {},
    reconnect = false
  } = {}) => {
    const client = new CozyClient({ uri: 'http://cozy.localhost:8080' })
    client.fetchQueryAndGetFromState = jest.fn()
    client.plugins = {
      realtime: {
        subscribe: jest.fn(),
        unsubscribe: jest.fn()
      }
    }
    const konnector = {}
    const flow = new ConnectionFlow(client, null, konnector)
    flow.getState = jest.fn().mockReturnValue(flowState)

    const root = await render(
      <AppLike client={client}>
        <OAuthForm
          account={account}
          flow={flow}
          konnector={fixtures.konnector}
          reconnect={reconnect}
          t={t}
        />
      </AppLike>
    )
    // Wait for next tick so the effects of useOAuthExtraParams are done
    await act(() => new Promise(setImmediate))

    return { root, client }
  }

  it('should render', async () => {
    const { root } = await setup()
    expect(root.container).toMatchSnapshot()
  })

  it('should bypass reconnect button when updating an account', async () => {
    const { root } = await setup({
      account: fixtures.account,
      reconnect: true
    })
    expect(root.container).toMatchSnapshot()
  })

  it('should call policy fetchExtraOAuthUrlParams with proper params', async () => {
    const { client } = await setup({ account: fixtures.account })
    expect(fetchExtraOAuthUrlParams).toHaveBeenCalledWith({
      account: fixtures.account,
      client,
      konnector: fixtures.konnector,
      reconnect: false
    })
  })

  it('should handle oauth cancelation', async () => {
    const { root } = await setup({
      flowState: {
        running: true,
        error: new KonnectorJobError('OAUTH_CANCELED')
      }
    })
    expect(root.container).toMatchSnapshot()

    const result = await setup({
      flowState: {
        running: false,
        error: new KonnectorJobError('OAUTH_CANCELED')
      }
    })
    expect(result.root.container).toMatchSnapshot()
  })
})
