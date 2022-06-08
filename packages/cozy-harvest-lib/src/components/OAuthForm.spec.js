/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { OAuthForm } from 'components/OAuthForm'
import { findKonnectorPolicy } from '../konnector-policies'
jest.mock('../konnector-policies', () => ({
  findKonnectorPolicy: jest.fn()
}))
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

describe('OAuthForm', () => {
  it('should render', () => {
    const component = shallow(
      <OAuthForm flowState={{}} konnector={fixtures.konnector} t={t} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render reconnect button when updating an account', () => {
    const component = shallow(
      <OAuthForm
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
      flow: undefined,
      konnector: { slug: 'test-konnector' }
    })
  })
})
