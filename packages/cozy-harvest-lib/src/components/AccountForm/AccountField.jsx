import Field from 'cozy-ui/react/Field'
import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'

import { translate } from 'cozy-ui/react/I18n'

import { getFieldPlaceholder, sanitizeSelectProps } from '../../helpers/fields'

const IDENTIFIER = 'identifier'

const predefinedLabels = [
  'answer',
  'birthdate',
  'code',
  'date',
  'email',
  'firstname',
  'lastname',
  'login',
  'password',
  'phone'
]

// Out of scope labels already used, should be transferred directly in manifests
// in the future.
const legacyLabels = [
  'branchName' // Used in banking konnectors
]

export class AccountField extends PureComponent {
  constructor(props) {
    super(props)
    // Ref to identifier input
    this.inputRef = null
    this.setInputRef = this.setInputRef.bind(this)
  }

  componentDidMount() {
    const { role } = this.props
    if (role === IDENTIFIER && this.inputRef) {
      this.inputRef.focus()
    }
  }

  setInputRef(element) {
    this.inputRef = element
  }

  render() {
    const {
      disabled,
      hasError,
      initialValue,
      label,
      name,
      required,
      role,
      t,
      type
    } = this.props

    // Allow manifest to specify predefined label
    const localeKey =
      predefinedLabels.includes(label) || legacyLabels.includes(label)
        ? label
        : name

    const isEditable = !(role === IDENTIFIER && initialValue)

    const fieldProps = {
      ...this.props,
      autoComplete: 'off',
      className: 'u-m-0', // 0 margin
      disabled: disabled || !isEditable,
      error: hasError,
      fullwidth: true,
      inputRef: this.setInputRef,
      label: t(`fields.${localeKey}.label`, {
        _: t(`legacy.fields.${localeKey}.label`, { _: name })
      }),
      placeholder: getFieldPlaceholder(
        this.props,
        t(`fields.${name}.placeholder`, { _: '' })
      ),
      side: required ? null : t('accountForm.fields.optional'),
      size: 'medium'
    }
    const passwordLabels = {
      hideLabel: t('accountForm.password.hide'),
      showLabel: t('accountForm.password.show')
    }
    switch (type) {
      case 'date':
        return (
          <Field
            {...fieldProps}
            placeholder={t(`fields.${name}.placeholder`, {
              _: t(`default.dateFormat`).toLowerCase()
            })}
          />
        )
      case 'dropdown':
        return <Field {...sanitizeSelectProps(fieldProps)} />
      case 'password':
        return (
          <Field
            {...fieldProps}
            // Using the `new-password` value is the best way to avoid
            // autocomplete for password.
            // See https://stackoverflow.com/a/17721462/1135990
            autoComplete="new-password"
            secondaryLabels={passwordLabels}
          />
        )
      default:
        return <Field {...fieldProps} type="text" />
    }
  }
}

AccountField.propTypes = {
  hasError: PropTypes.bool,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  type: PropTypes.oneOf(['date', 'dropdown', 'email', 'password', 'text']),
  t: PropTypes.func
}

export default translate()(AccountField)
