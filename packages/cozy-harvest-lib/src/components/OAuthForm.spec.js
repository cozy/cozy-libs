/* eslint-env jest */
import React from 'react'
import { act, render } from '@testing-library/react'
import CozyClient from 'cozy-client'

import { OAuthForm } from 'components/OAuthForm'
import { findKonnectorPolicy } from '../konnector-policies'
import { KonnectorJobError } from '../helpers/konnectors'
import ConnectionFlow from '../models/ConnectionFlow'
import AppLike from '../../test/AppLike'

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

describe('OAuthForm', () => {
  const setup = async ({
    account = null,
    flowState = {},
    reconnect = false
  } = {}) => {
    const client = new CozyClient({ uri: 'http://cozy.localhost:8080' })
    const flow = new ConnectionFlow(client)
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

    return { root }
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
    await setup({ account: fixtures.account })
    expect(fetchExtraOAuthUrlParams).toHaveBeenCalledWith({
      account: fixtures.account,
      client: undefined,
      konnector: fixtures.konnector,
      reconnect: false
    })
  })

  it('should handle oauth cancelation', async () => {
    const { root } = await setup({
      flowState: { error: new KonnectorJobError('OAUTH_CANCELED') }
    })
    expect(root.container).toMatchSnapshot()
  })
})
