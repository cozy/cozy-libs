/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { OAuthForm } from 'components/OAuthForm'

const t = jest.fn().mockImplementation(key => key)

const fixtures = {
  konnector: {
    slug: 'test-konnector'
  }
}

describe('OAuthForm', () => {
  it('should render', () => {
    const component = shallow(
      <OAuthForm konnector={fixtures.konnector} t={t} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render button when update', () => {
    const component = shallow(
      <OAuthForm
        account={{ oauth: { access_token: '1234abcd' } }}
        konnector={fixtures.konnector}
        t={t}
      />
    ).getElement()
    expect(component).toBeNull()
  })
})
