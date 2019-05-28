/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { isMobile } from 'cozy-device-helper'

import { AccountForm } from 'components/AccountForm'

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

jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isMobile: jest.fn()
}))

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

  it('should render error', () => {
    const wrapper = shallow(
      <AccountForm
        error={new Error('Test error')}
        konnector={fixtures.konnector}
        onSubmit={onSubmit}
        t={t}
      />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render error', () => {
    const wrapper = shallow(
      <AccountForm
        error={new Error('Test error')}
        konnector={fixtures.konnector}
        onSubmit={onSubmit}
        showError={false}
        t={t}
      />
    )
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should inject initial values from account', () => {
    const wrapper = shallow(
      <AccountForm
        account={fixtures.account}
        konnector={fixtures.konnector}
        onSubmit={onSubmit}
        t={t}
      />
    )
    expect(wrapper.props().initialValues).toEqual(fixtures.account.auth)
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
        shallow(
          <AccountForm konnector={konnector} onSubmit={onSubmit} t={t} />,
          // Avoid componentDidMount
          { disableLifecycleMethods: true }
        )
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
        shallow(
          <AccountForm konnector={konnector} onSubmit={onSubmit} t={t} />,
          // Avoid componentDidMount
          { disableLifecycleMethods: true }
        )
      )
    })

    it("should be enabled if fields isn't required", () => {
      assertButtonEnabled(
        shallow(
          <AccountForm
            konnector={fixtures.konnectorWithOptionalFields}
            onSubmit={onSubmit}
            t={t}
          />,
          // Avoid componentDidMount
          { disableLifecycleMethods: true }
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
          />,
          // Avoid componentDidMount
          { disableLifecycleMethods: true }
        )
      )
    })

    it('should be enabled when an error exists', () => {
      const values = {
        username: 'foo',
        passphrase: 'bar'
      }
      assertButtonEnabled(
        shallow(
          <AccountForm
            error={new Error('Test error')}
            konnector={fixtures.konnector}
            initialValues={values}
            onSubmit={onSubmit}
            t={t}
          />,
          // Avoid componentDidMount
          { disableLifecycleMethods: true }
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

  describe('focusNext', () => {
    const loginInput = document.createElement('input')
    const passwordInput = document.createElement('input')

    it('should focus next input', () => {
      const wrapper = shallow(
        <AccountForm konnector={fixtures.konnector} onSubmit={onSubmit} t={t} />
      )

      wrapper.instance().inputs = { login: loginInput, password: passwordInput }
      wrapper.instance().inputs.login.focus()
      wrapper.instance().inputFocused = loginInput

      const firstFocus = wrapper.instance().focusNext()
      expect(firstFocus).toEqual(passwordInput)

      wrapper.instance().inputFocused = passwordInput
      const secondFocus = wrapper.instance().focusNext()
      expect(secondFocus).toBeNull()
    })
  })

  describe('handleKeyUp', () => {
    it('should ignore other keys than ENTER', () => {
      isMobile.mockReturnValue(false)
      const wrapper = shallow(
        <AccountForm
          konnector={fixtures.konnector}
          onSubmit={onSubmit}
          t={t}
        />,
        // Avoid componentDidMount
        { disableLifecycleMethods: true }
      )

      wrapper.instance().handleSubmit = jest.fn()

      wrapper.instance().handleKeyUp({ key: 'Space' }, {})
      expect(wrapper.instance().handleSubmit).not.toHaveBeenCalled()
    })

    it('should submit form', () => {
      isMobile.mockReturnValue(false)
      const wrapper = shallow(
        <AccountForm
          konnector={fixtures.konnector}
          onSubmit={onSubmit}
          t={t}
        />,
        // Avoid componentDidMount
        { disableLifecycleMethods: true }
      )

      wrapper.instance().handleSubmit = jest.fn()
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(true)

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().handleSubmit).toHaveBeenCalled()
    })

    it('should not submit form', () => {
      isMobile.mockReturnValue(false)
      const wrapper = shallow(
        <AccountForm
          konnector={fixtures.konnector}
          onSubmit={onSubmit}
          t={t}
        />,
        // Avoid componentDidMount
        { disableLifecycleMethods: true }
      )

      wrapper.instance().handleSubmit = jest.fn()
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(false)

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().handleSubmit).not.toHaveBeenCalled()
    })

    it('should focus next input on mobile', () => {
      isMobile.mockReturnValue(true)
      const wrapper = shallow(
        <AccountForm
          konnector={fixtures.konnector}
          onSubmit={onSubmit}
          t={t}
        />,
        // Avoid componentDidMount
        { disableLifecycleMethods: true }
      )

      wrapper.instance().focusNext = jest
        .fn()
        .mockReturnValue(document.createElement('input'))

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().focusNext).toHaveBeenCalled()
    })

    it('should submit form on mobile', () => {
      isMobile.mockReturnValue(true)
      const wrapper = shallow(
        <AccountForm
          konnector={fixtures.konnector}
          onSubmit={onSubmit}
          t={t}
        />,
        // Avoid componentDidMount
        { disableLifecycleMethods: true }
      )

      wrapper.instance().focusNext = jest.fn().mockReturnValue(null)
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(true)
      wrapper.instance().handleSubmit = jest.fn()

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().focusNext).toHaveBeenCalled()
      expect(wrapper.instance().handleSubmit).toHaveBeenCalled()
    })

    it('should not submit form on mobile', () => {
      isMobile.mockReturnValue(true)
      const wrapper = shallow(
        <AccountForm
          konnector={fixtures.konnector}
          onSubmit={onSubmit}
          t={t}
        />,
        // Avoid componentDidMount
        { disableLifecycleMethods: true }
      )

      wrapper.instance().focusNext = jest.fn().mockReturnValue(null)
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(false)
      wrapper.instance().handleSubmit = jest.fn()

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().focusNext).toHaveBeenCalled()
      expect(wrapper.instance().handleSubmit).not.toHaveBeenCalled()
    })
  })
})
