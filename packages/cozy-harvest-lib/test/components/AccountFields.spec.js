import React from 'react'
import { shallow } from 'enzyme'

import { AccountFields } from 'components/AccountForm/AccountFields'

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
      <AccountFields manifestFields={fixtures.fields} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render encrypted fields with placeholder', () => {
    const component = shallow(
      <AccountFields manifestFields={fixtures} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
