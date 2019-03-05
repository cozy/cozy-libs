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
  konnector: {
    fields: {
      username: {
        type: 'text'
      },
      passphrase: {
        type: 'password'
      }
    }
  },
  konnectorWithOptionalFields: {
    fields: {
      test: {
        required: false,
        type: 'text'
      }
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
      <AccountForm konnector={fixtures.konnector} onSubmit={onSubmit} t={t} />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should inject initial values from account', () => {
    const wrapper = shallow(
      <AccountForm
        account={fixtures.account}
        konnector={fixtures.konnector}
        t={t}
      />
    )
    expect(wrapper.props().initialValues).toEqual(fixtures.account.auth)
  })

  it('should redirect to OAuthForm', () => {
    const konnector = {
      oauth: {
        scope: 'test'
      }
    }

    const component = shallow(
      <AccountForm konnector={konnector} onSubmit={onSubmit} t={t} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should provide default values from manifest', () => {
    const konnector = {
      fields: {
        foo: {
          default: 'bar',
          type: 'text'
        }
      }
    }
    const wrapper = shallow(
      <AccountForm konnector={konnector} onSubmit={onSubmit} t={t} />
    )
    expect(wrapper.props().initialValues).toEqual({
      foo: 'bar'
    })
  })

  describe('Submit Button', () => {
    const getButtonDisabledValue = wrapper =>
      wrapper
        .dive()
        .find('DefaultButton')
        .props().disabled

    const assertButtonDisabled = wrapper =>
      expect(getButtonDisabledValue(wrapper)).toBe(true)

    const assertButtonEnabled = wrapper =>
      expect(getButtonDisabledValue(wrapper)).toBe(false)

    it('should be disabled if there is required field empty', () => {
      const konnector = {
        fields: {
          test: {
            type: 'text'
          }
        }
      }

      assertButtonDisabled(
        shallow(<AccountForm konnector={konnector} onSubmit={onSubmit} t={t} />)
      )
    })

    it("should be enabled if required field isn't empty", () => {
      const konnector = {
        fields: {
          test: {
            default: 'test',
            type: 'text'
          }
        }
      }
      assertButtonEnabled(
        shallow(<AccountForm konnector={konnector} onSubmit={onSubmit} t={t} />)
      )
    })

    it("should be enabled if fields isn't required", () => {
      assertButtonEnabled(
        shallow(
          <AccountForm
            konnector={fixtures.konnectorWithOptionalFields}
            onSubmit={onSubmit}
            t={t}
          />
        )
      )
    })

    it('should be disabled with initialValues', () => {
      const account = {
        auth: {
          username: 'foo',
          passphrase: 'bar'
        }
      }

      assertButtonDisabled(
        shallow(
          <AccountForm
            account={account}
            konnector={fixtures.konnector}
            onSubmit={onSubmit}
            t={t}
          />
        )
      )
    })
  })

  it('should call onSubmit on click', () => {
    const wrapper = shallow(
      <AccountForm
        account={fixtures.account}
        konnector={fixtures.konnectorWithOptionalFields}
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
        <AccountFields manifestFields={fixtures.konnector.fields} t={t} />
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
