import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { isIOS } from 'cozy-device-helper'

import { Field } from './Field'
import { getFieldPlaceholder, sanitizeSelectProps } from '../../helpers/fields'
import {
  legacyLabels,
  predefinedLabels,
  ROLE_IDENTIFIER
} from '../../helpers/manifest'

// On iOS, focusing an input not in the same tick as the user action is buggy.
// The field is focused but the keyboard does not show up,
// See https://github.com/apache/cordova-plugin-wkwebview-engine/pull/37/#issuecomment-308321094
const canAutofocus = () => {
  if (isIOS()) {
    return false
  }
  return true
}

/*
 * Password manager extensions try to find strings like "login" and "password" in
 * inputs name and id. We need to map these so it is not included in these
 * attributes
 */
const fieldNameRemap = {
  login: 'lgn',
  password: 'pwd'
}

const getFieldName = originalName => {
  return fieldNameRemap[originalName] || originalName
}

/**
 * AccountField encapsulate an unique Cozy-UI Field component.
 * It maps its own props to Cozy-UI Field ones, and deal with i18n and locale
 * logic.
 *
 * AccountField also expect to receive all properties defined in manifest
 * fields.
 */
export class AccountField extends PureComponent {
  constructor(props) {
    super(props)
    // Ref to identifier input, needed to give focus to identifier
    this.inputRef = null
    this.setInputRef = this.setInputRef.bind(this)
  }

  componentDidMount() {
    const { role } = this.props
    if (role === ROLE_IDENTIFIER && this.inputRef && canAutofocus()) {
      this.inputRef.focus()
    }
  }

  setInputRef(element) {
    this.inputRef = element

    const { inputRef } = this.props
    if (typeof inputRef === 'function') {
      inputRef(element)
    }
  }

  render() {
    const {
      disabled,
      hasError,
      forceEncryptedPlaceholder,
      label,
      name,
      required,
      t,
      type
    } = this.props

    // Allow manifest to specify predefined label
    const localeKey =
      predefinedLabels.includes(label) || legacyLabels.includes(label)
        ? label
        : name

    const finalName = getFieldName(name)
    const placeholder = getFieldPlaceholder(
      this.props,
      t(`fields.${name}.placeholder`, { _: '' }),
      { forceEncryptedPlaceholder }
    )

    // Cozy-UI <Field /> props
    const fieldProps = {
      ...this.props,
      name: finalName,
      id: `harvest-account-${finalName}`,
      autoCapitalize: 'none',
      autoComplete: 'off',
      className: 'u-m-0', // 0 margin
      disabled: disabled,
      error: !disabled && hasError,
      fullwidth: true,
      inputRef: this.setInputRef,
      label: t(`fields.${localeKey}.label`, {
        _: t(`legacy.fields.${localeKey}.label`, { _: name })
      }),
      placeholder,
      side: required ? null : t('accountForm.fields.optional'),
      size: 'medium'
    }

    const passwordLabels = {
      hideLabel: t('accountForm.password.hide'),
      showLabel: t('accountForm.password.show')
    }
    const changePlaceholder = placeholder => e => {
      e.target.placeholder = placeholder
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
        return (
          <Field {...sanitizeSelectProps(fieldProps)} menuPosition="fixed" />
        )
      case 'password':
        return (
          <Field
            {...fieldProps}
            onFocus={changePlaceholder('')}
            onBlur={changePlaceholder(placeholder)}
            secondaryLabels={passwordLabels}
          />
        )
      case 'hidden':
        return (
          <input {...pick(fieldProps, ['value', 'type', 'name', 'role'])} />
        )
      default:
        return <Field {...fieldProps} type="text" />
    }
  }
}

AccountField.propTypes = {
  /**
   * Indicates if the <Field /> should be rendered with an error style.
   */
  hasError: PropTypes.bool,
  /**
   * Initial value of the field
   */
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * A callback to call on Field input ref.
   */
  inputRef: PropTypes.func,
  /**
   * Optionnal predefined label, used as locale key.
   */
  label: PropTypes.oneOf([...predefinedLabels, ...legacyLabels]),
  /**
   * field name as declared in manifest, used as locale key and as fallback for
   * label
   */
  name: PropTypes.string.isRequired,
  /**
   * Indicates if the field is required. Non-required fields will be indicated
   * as "optional"
   */
  required: PropTypes.bool,
  /**
   * Indicates fields role. Defined in manifest or during fields sanitization.
   * Valid values are ['identifier', 'password'].
   * The field having role identifier will be given focus.
   */
  role: PropTypes.string,
  /**
   * Field type, passed to <Field /> component. Except for "dropdown" which
   * will be mapped to "select"
   */
  type: PropTypes.oneOf([
    'date',
    'dropdown',
    'email',
    'password',
    'text',
    'hidden'
  ]),
  /**
   * Translation function
   */
  t: PropTypes.func
}

export default AccountField
