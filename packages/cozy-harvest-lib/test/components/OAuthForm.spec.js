/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { OAuthForm } from 'components/OAuthForm'

const t = jest.fn().mockImplementation(key => key)

describe('OAuthForm', () => {
  it('should render', () => {
    const component = shallow(<OAuthForm t={t} />).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render button when update', () => {
    const component = shallow(
      <OAuthForm t={t} initialValues={{ access_token: '1234abcd' }} />
    ).getElement()
    expect(component).toBeNull()
  })
})
