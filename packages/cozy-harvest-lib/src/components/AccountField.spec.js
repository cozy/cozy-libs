import React from 'react'
import { shallow } from 'enzyme'
import PropTypes from 'prop-types'

import { AccountField } from 'components/AccountForm/AccountField'

const fixtures = {
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

const t = jest.fn()

describe('AccountField', () => {
  beforeEach(() => {
    t.mockClear()
    t.mockImplementation(key => key)
  })

  it('should render', () => {
    const wrapper = shallow(
      <AccountField {...fixtures.username} name="username" t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('render a date field', () => {
    const wrapper = shallow(
      <AccountField required={true} type="date" name="date" t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('render a password field', () => {
    const wrapper = shallow(
      <AccountField {...fixtures.passphrase} name="passphrase" t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('hide the password toggle on empty fields', () => {
    const wrapper = shallow(
      <AccountField {...fixtures.passphrase} name="passphrase" t={t} value="" />
    )
    const component = wrapper.dive().dive()
    expect(component.prop('side')).toBe(null)
  })

  it('show the password toggle on non-empty fields', () => {
    const wrapper = shallow(
      <AccountField
        {...fixtures.passphrase}
        name="passphrase"
        value="123"
        t={t}
      />
    )
    const component = wrapper.dive().dive()
    expect(component.prop('side')).not.toBe(null)
  })

  it('render a dropdown field', () => {
    const options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' }
    ]

    const wrapper = shallow(
      <AccountField
        name="multiple"
        options={options}
        required={true}
        t={t}
        type="dropdown"
      />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('uses predefined label', () => {
    const wrapper = shallow(
      <AccountField
        label="login"
        name="username"
        required={true}
        type="text"
        t={t}
      />
    )
    expect(wrapper.props().label).toBe('fields.login.label')
  })

  it('ignores invalid predefined label', () => {
    // Avoid warning
    class AccountFieldWithPermissiveLabel extends AccountField {}
    AccountFieldWithPermissiveLabel.propTypes = {
      ...AccountField.propTypes,
      label: PropTypes.string
    }

    const wrapper = shallow(
      <AccountFieldWithPermissiveLabel
        label="foo"
        name="username"
        required={true}
        type="text"
        t={t}
      />
    )
    expect(wrapper.props().label).toBe('fields.username.label')
  })
})
