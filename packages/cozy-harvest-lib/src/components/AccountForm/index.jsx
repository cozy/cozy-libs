import React, { PureComponent } from 'react'
import { Form, Field as FinalFormField } from 'react-final-form'
import PropTypes from 'react-proptypes'

import Button from 'cozy-ui/react/Button'
import { translate, extend } from 'cozy-ui/react/I18n'
import Field from 'cozy-ui/react/Field'

import AccountFormError from './Error'
import {
  getEncryptedFieldName,
  getFieldPlaceholder,
  sanitizeSelectProps
} from 'helpers/fields'
import { KonnectorJobError } from 'helpers/konnectors'
import Manifest from 'Manifest'
import OAuthForm from 'components/OAuthForm'

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

const VALIDATION_ERROR_REQUIRED_FIELD = 'VALIDATION_ERROR_REQUIRED_FIELD'

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
            // Usting the `new-password` value is the best way to avoid
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

// As SelectBox component from Cozy-UI, rendering dropdown type, is just giving
// us the full Option object, we just get its value to facilitate mapping
// with account
const parse = type => value => {
  return type === 'dropdown' ? value.value : value
}

export class AccountFields extends PureComponent {
  render() {
    const {
      container,
      disabled,
      hasError,
      initialValues,
      manifestFields,
      onKeyUp,
      t
    } = this.props

    // Ready to use named fields array
    const namedFields = Object.keys(manifestFields).map(fieldName => ({
      ...manifestFields[fieldName],
      name: fieldName
    }))

    return (
      <div onKeyUp={onKeyUp}>
        {namedFields.map((field, index) => (
          <FinalFormField
            key={index}
            name={field.name}
            parse={parse(field.type)}
          >
            {({ input }) => (
              <AccountField
                {...field}
                {...input}
                container={container}
                hasError={hasError}
                disabled={disabled}
                initialValue={
                  initialValues[field.name] ||
                  initialValues[getEncryptedFieldName(field.name)]
                }
                t={t}
              />
            )}
          </FinalFormField>
        ))}
      </div>
    )
  }
}

AccountFields.propTypes = {
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  fillEncrypted: PropTypes.bool,
  manifestFields: PropTypes.object.isRequired,
  onKeyUp: PropTypes.func,
  t: PropTypes.func
}

export class AccountForm extends PureComponent {
  constructor(props, context) {
    super(props, context)
    const { konnector, lang } = props
    const { locales } = konnector
    if (locales && lang) {
      extend(locales[lang])
    }
  }

  /**
   * Indicates if the state of ReactFinalForm implies that data can be submitted
   * @param  {Object} formState See https://github.com/final-form/final-form#formstate
   * @return {Boolean}
   */
  isSubmittable({ dirty, error, initialValues, valid }) {
    const untouched = initialValues && !dirty
    return error || (valid && !untouched)
  }

  handleKeyUp(event, { dirty, form, initialValues, valid, values }) {
    if (
      event.code === 'Enter' &&
      this.isSubmittable({ dirty, initialValues, valid })
    ) {
      this.handleSubmit(values, form)
    }
  }

  handleSubmit(values, form) {
    const { onSubmit } = this.props
    // Reset form with new values to set back dirty to false
    form.reset(values)
    onSubmit(values)
  }

  validate = (fields, initialValues) => vals => {
    let errors = {}
    for (let name in fields)
      if (
        fields[name].required &&
        !vals[name] &&
        // Don't require value for empty encrypted fields with initial value
        !initialValues[getEncryptedFieldName(name)]
      )
        errors[name] = VALIDATION_ERROR_REQUIRED_FIELD
    return errors
  }

  render() {
    const {
      account,
      error,
      konnector,
      onSubmit,
      showError,
      submitting,
      t
    } = this.props
    const { fields, oauth } = konnector

    if (oauth) return <OAuthForm initialValues={initialValues} oauth={oauth} />

    const sanitizedFields = Manifest.sanitizeFields(fields)
    const defaultValues = Manifest.defaultFieldsValues(sanitizedFields)
    const initialValues = account && account.auth
    const initialAndDefaultValues = { ...defaultValues, ...initialValues }

    let container = null

    const isLoginError =
      error instanceof KonnectorJobError && error.isLoginError()

    return (
      <Form
        initialValues={initialAndDefaultValues}
        onSubmit={onSubmit}
        validate={this.validate(sanitizedFields, initialAndDefaultValues)}
        render={({ dirty, form, values, valid }) => (
          <div
            ref={element => {
              container = element
            }}
          >
            {error && (showError || isLoginError) && (
              <AccountFormError error={error} konnector={konnector} t={t} />
            )}
            <AccountFields
              container={container}
              disabled={submitting}
              hasError={
                error &&
                error instanceof KonnectorJobError &&
                error.isLoginError()
              }
              initialValues={initialAndDefaultValues}
              manifestFields={sanitizedFields}
              onKeyUp={event =>
                this.handleKeyUp(event, {
                  dirty,
                  form,
                  initialValues,
                  valid,
                  values
                })
              }
              t={t}
            />
            <Button
              busy={submitting}
              className="u-mt-2 u-mb-1-half"
              disabled={
                submitting ||
                !this.isSubmittable({ dirty, error, initialValues, valid })
              }
              extension="full"
              label={t('accountForm.submit.label')}
              onClick={() => this.handleSubmit(values, form)}
            />
          </div>
        )}
      />
    )
  }
}

AccountForm.propTypes = {
  account: PropTypes.object,
  konnector: PropTypes.object.isRequired,
  error: PropTypes.object,
  showError: PropTypes.bool,
  submitting: PropTypes.bool
}

AccountForm.defaultProps = {
  showError: true
}

export default translate()(AccountForm)
