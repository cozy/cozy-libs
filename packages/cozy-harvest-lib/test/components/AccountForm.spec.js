/* eslint-env jest */
import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {
  AccountForm,
  AccountFields,
  AccountField
} from 'components/AccountForm'

configure({ adapter: new Adapter() })

const fixtures = {
  fields: {
    username: {
      type: 'text'
    },
    passphrase: {
      type: 'password'
    }
  },
  sanitized: {
    username: {
      encrypted: false,
      required: true,
      type: 'text'
    },
    passphrase: {
      encrypted: true,
      required: true,
      type: 'password'
    }
  }
}

const t = jest.fn().mockImplementation(key => key)

describe('AccountForm', () => {
  it('should render', () => {
    const wrapper = shallow(<AccountForm fields={fixtures.fields} t={t} />)
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  describe('AccountFields', () => {
    it('should render', () => {
      const component = shallow(
        <AccountFields manifestFields={fixtures.fields} t={t} />
      ).getElement()
      expect(component).toMatchSnapshot()
    })
  })

  describe('AccountField', () => {
    it('should render', () => {
      const wrapper = shallow(
        <AccountField {...fixtures.sanitized.username} name="username" t={t} />
      )
      const component = wrapper.dive().getElement()
      expect(component).toMatchSnapshot()
    })

    it('render password', () => {
      const wrapper = shallow(
        <AccountField
          {...fixtures.sanitized.passphrase}
          name="passphrase"
          t={t}
        />
      )
      const component = wrapper.dive().getElement()
      expect(component).toMatchSnapshot()
    })
  })
})
