/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { OAuthForm } from 'components/OAuthForm'
import { findKonnectorPolicy } from '../konnector-policies'
import { KonnectorJobError } from '../helpers/konnectors'
import ConnectionFlow from '../models/ConnectionFlow'
jest.mock('../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))
jest.mock('../models/ConnectionFlow')
const fetchExtraOAuthUrlParams = jest.fn()
fetchExtraOAuthUrlParams.mockResolvedValue({})
findKonnectorPolicy.mockReturnValue({
  fetchExtraOAuthUrlParams: fetchExtraOAuthUrlParams
})

const t = jest.fn().mockImplementation(key => key)

const fixtures = {
  konnector: {
    slug: 'test-konnector'
  }
}

const flow = new ConnectionFlow()

describe('OAuthForm', () => {
  it('should render', () => {
    const component = shallow(
      <OAuthForm
        flow={flow}
        flowState={{}}
        konnector={fixtures.konnector}
        t={t}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should bypass reconnect button when updating an account', () => {
    const component = shallow(
      <OAuthForm
        flow={flow}
        flowState={{}}
        account={{ oauth: { access_token: '1234abcd' } }}
        konnector={fixtures.konnector}
        reconnect={true}
        t={t}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
  it('should call policy fetchExtraOAuthUrlParams with proper params', () => {
    shallow(
      <OAuthForm
        flow={flow}
        flowState={{}}
        account={{ oauth: { access_token: '1234abcd' } }}
        konnector={fixtures.konnector}
        t={t}
      />
    )
    expect(fetchExtraOAuthUrlParams).toHaveBeenCalledWith({
      account: {
        oauth: { access_token: '1234abcd' }
      },
      client: undefined,
      flow,
      konnector: { slug: 'test-konnector' }
    })
  })
  it('should handle oauth cancelation', () => {
    const component = shallow(
      <OAuthForm
        flow={flow}
        flowState={{ error: new KonnectorJobError('OAUTH_CANCELED') }}
        konnector={fixtures.konnector}
        t={t}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
