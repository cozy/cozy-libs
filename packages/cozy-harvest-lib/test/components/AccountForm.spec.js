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
  optionalFields: {
    test: {
      required: false,
      type: 'text'
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
  },
  account: {
    auth: {
      username: 'Toto',
      credentials_encrypted:
        'bmFjbGj8JQfzzfTQ2aGKTpI+HI9N8xKAQqPTPD6/84x5GyiHm2hdn7N6rO8cLTCnkdsnd2eFWJRf'
    }
  },
  oauth: {
    scope: 'test'
  }
}

const onSubmit = jest.fn()
const t = jest.fn()

describe('AccountForm', () => {
  beforeEach(() => {
    t.mockClear()
    t.mockImplementation(key => key)
    onSubmit.mockClear()
  })

  it('should render', () => {
    const wrapper = shallow(
      <AccountForm fields={fixtures.fields} onSubmit={onSubmit} t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should inject initial values from account', () => {
    const wrapper = shallow(
      <AccountForm
        initialValues={fixtures.account.auth}
        fields={fixtures.fields}
        t={t}
      />
    )
    expect(wrapper.props().initialValues).toEqual(fixtures.account.auth)
  })

  it('should redirect to OAuthForm', () => {
    const component = shallow(
      <AccountForm oauth={fixtures.oauth} onSubmit={onSubmit} t={t} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should provide default values from manifest', () => {
    const fields = {
      foo: {
        default: 'bar',
        type: 'text'
      }
    }
    const wrapper = shallow(
      <AccountForm fields={fields} onSubmit={onSubmit} t={t} />
    )
    expect(wrapper.props().initialValues).toEqual({
      foo: 'bar'
    })
  })

  it('should have disabled button if there is required field empty', () => {
    const fields = {
      test: {
        type: 'text'
      }
    }
    const wrapper = shallow(
      <AccountForm fields={fields} onSubmit={onSubmit} t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it("should have enabled button if required field isn't empty", () => {
    const fields = {
      test: {
        default: 'test',
        type: 'text'
      }
    }
    const wrapper = shallow(
      <AccountForm fields={fields} onSubmit={onSubmit} t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it("should have enabled button if fields isn't required", () => {
    const wrapper = shallow(
      <AccountForm fields={fixtures.optionalFields} onSubmit={onSubmit} t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should call onSubmit on click', () => {
    const wrapper = shallow(
      <AccountForm
        fields={fixtures.optionalFields}
        initialValues={fixtures.account.auth}
        onSubmit={onSubmit}
        t={t}
      />
    )
    wrapper
      .dive()
      .find('DefaultButton')
      .simulate('click')

    expect(onSubmit).toHaveBeenCalled()
  })

  describe('AccountFields', () => {
    it('should render', () => {
      const component = shallow(
        <AccountFields manifestFields={fixtures.fields} t={t} />
      ).getElement()
      expect(component).toMatchSnapshot()
    })

    it('should render encrypted fields with placeholder', () => {
      const component = shallow(
        <AccountFields manifestFields={fixtures.sanitized} t={t} />
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

    it('render a date field', () => {
      const wrapper = shallow(
        <AccountField required={true} type="date" name="date" t={t} />
      )
      const component = wrapper.dive().getElement()
      expect(component).toMatchSnapshot()
    })

    it('render a password field', () => {
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
      const wrapper = shallow(
        <AccountField
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
})
