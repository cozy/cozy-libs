import { AccountFields } from 'components/AccountForm/AccountFields'
import { shallow } from 'enzyme'
import React from 'react'

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

describe('AccountFields', () => {
  it('should render', () => {
    const component = shallow(
      <AccountFields fields={fixtures.fields} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render encrypted fields with placeholder', () => {
    const component = shallow(
      <AccountFields fields={fixtures.sanitized} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
