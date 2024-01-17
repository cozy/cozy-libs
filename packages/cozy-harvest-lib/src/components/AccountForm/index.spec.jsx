/* eslint-env jest */
import { fireEvent, render } from '@testing-library/react'
import { AccountForm } from 'components/AccountForm'
import { shallow, mount } from 'enzyme'
import enLocale from 'locales/en.json'
import Polyglot from 'node-polyglot'
import PropTypes from 'prop-types'
import React from 'react'

import { isMobile } from 'cozy-device-helper'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

const polyglot = new Polyglot()
polyglot.extend(enLocale)

const t = polyglot.t.bind(polyglot)
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
  clientSideKonnector: {
    clientSide: true,
    name: 'testkonnector',
    fields: {}
  },
  konnectorWithOptionalFields: {
    fields: {
      test: {
        required: false,
        type: 'text'
      }
    }
  },
  konnectorWithIdendifierAndSecret: {
    fields: {
      identifier: {
        type: 'text'
      },
      secret: {
        type: 'password'
      }
    }
  },
  konnectorWithAdvancedField: {
    fields: {
      advancedFields: {
        folderPath: {
          advanced: true,
          isRequired: false
        }
      },
      username: {
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

jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isMobile: jest.fn()
}))

jest.mock('components/KonnectorIcon', () => {
  const KonnectorIcon = () => <div>KonnectorIcon</div>

  return KonnectorIcon
})

describe('AccountForm', () => {
  beforeEach(() => {
    onSubmit.mockClear()
  })

  const setup = ({
    error,
    showError,
    account,
    konnector,
    disableLifecycleMethods
  } = {}) => {
    const flowState = { error }
    const wrapper = shallow(
      <AccountForm
        flowState={flowState}
        account={account}
        konnector={konnector || fixtures.konnector}
        onSubmit={onSubmit}
        showError={showError}
        t={t}
        fieldOptions={{}}
      />,
      { disableLifecycleMethods }
    )
    return { wrapper }
  }

  it('should render', () => {
    const { wrapper } = setup()
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render with specific message when client side konnector without launcher', () => {
    const { wrapper } = setup({ konnector: fixtures.clientSideKonnector })
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render normally when client side konnector with launcher', () => {
    const windowSpy = jest.spyOn(window, 'window', 'get')
    windowSpy.mockImplementation(() => ({
      cozy: {
        ClientConnectorLauncher: 'react-native'
      }
    }))
    const { wrapper } = setup({ konnector: fixtures.clientSideKonnector })
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
    windowSpy.mockRestore()
  })

  it('should render error', () => {
    const { wrapper } = setup({
      error: new Error('Test error')
    })
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should not render error', () => {
    const { wrapper } = setup({
      error: new Error('Test error'),
      showError: false
    })
    const component = wrapper.dive().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should inject initial values from account', () => {
    const { wrapper } = setup({
      account: fixtures.account
    })
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
    const { wrapper } = setup({
      konnector
    })
    expect(wrapper.props().initialValues).toEqual({
      foo: 'bar'
    })
  })

  describe('Submit Button', () => {
    const getButtonDisabledValue = wrapper =>
      wrapper.dive().find('[data-testid="submit-btn"]').props().disabled

    const assertButtonDisabled = wrapper =>
      expect(getButtonDisabledValue(wrapper)).toBe(true)

    const assertButtonEnabled = wrapper =>
      expect(getButtonDisabledValue(wrapper)).toBe(false)

    it('should call onSubmit on click', () => {
      const { wrapper } = setup({
        konnector: fixtures.konnectorWithOptionalFields
      })
      wrapper.dive().find('[data-testid="submit-btn"]').simulate('click')

      expect(onSubmit).toHaveBeenCalled()
    })

    it('should be disabled if there is required field empty', () => {
      const konnector = {
        fields: {
          test: {
            type: 'text'
          }
        }
      }

      const { wrapper } = setup({ konnector })

      assertButtonDisabled(wrapper)
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
      const { wrapper } = setup({ konnector })
      assertButtonEnabled(wrapper)
    })

    it("should be enabled if fields isn't required", () => {
      const { wrapper } = setup({
        konnector: fixtures.konnectorWithOptionalFields
      })
      assertButtonEnabled(wrapper)
    })

    it('should be enabled when an error exists', () => {
      const account = {}
      const error = new Error('Test error')
      const { wrapper } = setup({ account, error })
      assertButtonEnabled(wrapper)
    })
  })

  describe('focusNext', () => {
    const loginInput = document.createElement('input')
    const passwordInput = document.createElement('input')

    it('should focus next input', () => {
      const { wrapper } = setup()

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
      const { wrapper } = setup()
      wrapper.instance().handleSubmit = jest.fn()

      wrapper.instance().handleKeyUp({ key: 'Space' }, {})
      expect(wrapper.instance().handleSubmit).not.toHaveBeenCalled()
    })

    it('should submit form', () => {
      isMobile.mockReturnValue(false)
      const { wrapper } = setup()

      wrapper.instance().handleSubmit = jest.fn()
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(true)

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().handleSubmit).toHaveBeenCalled()
    })

    it('should not submit form', () => {
      isMobile.mockReturnValue(false)
      const { wrapper } = setup({})

      wrapper.instance().handleSubmit = jest.fn()
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(false)

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().handleSubmit).not.toHaveBeenCalled()
    })

    it('should focus next input on mobile', () => {
      isMobile.mockReturnValue(true)
      const { wrapper } = setup()

      wrapper.instance().focusNext = jest
        .fn()
        .mockReturnValue(document.createElement('input'))

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().focusNext).toHaveBeenCalled()
    })

    it('should submit form on mobile', () => {
      isMobile.mockReturnValue(true)
      const { wrapper } = setup()

      wrapper.instance().focusNext = jest.fn().mockReturnValue(null)
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(true)
      wrapper.instance().handleSubmit = jest.fn()

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().focusNext).toHaveBeenCalled()
      expect(wrapper.instance().handleSubmit).toHaveBeenCalled()
    })

    it('should not submit form on mobile', () => {
      isMobile.mockReturnValue(true)
      const { wrapper } = setup()

      wrapper.instance().focusNext = jest.fn().mockReturnValue(null)
      wrapper.instance().isSubmittable = jest.fn().mockReturnValue(false)
      wrapper.instance().handleSubmit = jest.fn()

      wrapper.instance().handleKeyUp({ key: 'Enter' }, {})
      expect(wrapper.instance().focusNext).toHaveBeenCalled()
      expect(wrapper.instance().handleSubmit).not.toHaveBeenCalled()
    })
  })

  describe('with read-only identifier', () => {
    it('should render a read-only identifier field if the account has a relationship with a vault cipher and props.readOnlyIdentifier is true', () => {
      const accountWithCipher = {
        ...fixtures.account,
        relationships: {
          vaultCipher: {
            _id: 'fake-cipher-id',
            _type: 'com.bitwarden.ciphers',
            _protocol: 'bitwarden'
          }
        }
      }
      const flowState = {}
      const wrapper = mount(
        <I18n lang="en" dictRequire={() => {}}>
          <AccountForm
            flowState={flowState}
            t={t}
            konnector={fixtures.konnector}
            onSubmit={onSubmit}
            account={accountWithCipher}
            readOnlyIdentifier={true}
            fieldOptions={{}}
          />
        </I18n>,
        {
          context: { t },
          childContextTypes: {
            t: PropTypes.func
          }
        }
      )

      const hiddenInput = wrapper.find('input[type="hidden"][name="username"]')

      expect(hiddenInput).toHaveLength(1)
    })
    it('should render a read-only identifier field even with advancedFields field in the manifest', () => {
      const accountWithCipher = {
        ...fixtures.account,
        relationships: {
          vaultCipher: {
            _id: 'fake-cipher-id',
            _type: 'com.bitwarden.ciphers',
            _protocol: 'bitwarden'
          }
        }
      }
      const flowState = {}
      const wrapper = mount(
        <I18n lang="en" dictRequire={() => {}}>
          <AccountForm
            flowState={flowState}
            t={t}
            konnector={fixtures.konnectorWithAdvancedField}
            onSubmit={onSubmit}
            account={accountWithCipher}
            readOnlyIdentifier={true}
            fieldOptions={{}}
          />
        </I18n>,
        {
          context: { t },
          childContextTypes: {
            t: PropTypes.func
          }
        }
      )

      const hiddenInput = wrapper.find('input[type="hidden"][name="username"]')

      expect(hiddenInput).toHaveLength(1)
    })
  })

  describe('fieldOptions', () => {
    const setup = fieldOptions => {
      const root = render(
        <I18n lang="en" dictRequire={() => {}}>
          <AccountForm
            flowState={{}}
            t={t}
            konnector={fixtures.konnectorWithIdendifierAndSecret}
            onSubmit={onSubmit}
            account={fixtures.account}
            readOnlyIdentifier={true}
            fieldOptions={fieldOptions}
          />
        </I18n>,
        {
          context: { t },
          childContextTypes: {
            t: PropTypes.func
          }
        }
      )
      return root
    }

    it('should render password placeholder', () => {
      const fieldOptions = {
        displaySecretPlaceholder: true,
        focusSecretField: false
      }
      const root = setup(fieldOptions)
      expect(root.getByPlaceholderText('*************')).toBeTruthy()
    })

    it('should not render password placeholder', () => {
      const fieldOptions = {
        displaySecretPlaceholder: false
      }
      const root = setup(fieldOptions)
      expect(root.queryByPlaceholderText('*************')).toBeFalsy()
    })

    it('should not render password placeholder with focus', () => {
      const fieldOptions = {
        focusSecretField: true
      }
      const root = setup(fieldOptions)
      expect(root.queryByPlaceholderText('*************')).toBeFalsy()
    })

    it('should not render password placeholder with values in identifier', () => {
      const fieldOptions = {}
      const root = setup(fieldOptions)
      const identifier = root.getAllByDisplayValue('')[0]
      fireEvent.change(identifier, { target: { value: 'newvalue' } })
      expect(root.queryByPlaceholderText('*************')).toBeFalsy()
    })
  })
})
