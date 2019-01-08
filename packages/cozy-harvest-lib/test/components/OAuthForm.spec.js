/* eslint-env jest */
import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { OAuthForm } from 'components/OAuthForm'

configure({ adapter: new Adapter() })

const t = jest.fn().mockImplementation(key => key)

describe('OAuthForm', () => {
  it('should render', () => {
    const component = shallow(<OAuthForm t={t} />).getElement()
    expect(component).toMatchSnapshot()
  })
})
