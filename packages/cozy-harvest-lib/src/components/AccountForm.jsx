import React, { PureComponent } from 'react'
import { Form, Field as FinalFormField } from 'react-final-form'
import PropTypes from 'react-proptypes'

import Button from 'cozy-ui/react/Button'
import { translate, extend } from 'cozy-ui/react/I18n'
import Field from 'cozy-ui/react/Field'

import {
  getEncryptedFieldName,
  getFieldPlaceholder,
  sanitizeSelectProps
} from '../helpers/fields'
import Manifest from '../Manifest'
import OAuthForm from './OAuthForm'

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
  render() {
    const {
      disabled,
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

    const isEditable = !(role === 'identifier' && initialValue)

    const fieldProps = {
      ...this.props,
      className: 'u-m-0', // 0 margin
      disabled: disabled || !isEditable,
      fullwidth: true,
      label: t(`fields.${localeKey}.label`, {
        _: t(`legacy.fields.${localeKey}.label`, { _: name })
      }),
      placeholder: getFieldPlaceholder(
        this.props,
        t(`fields.${name}.placeholder`, { _: '' })
      ),
      side: !required && t('accountForm.fields.optional'),
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
        return <Field {...fieldProps} secondaryLabels={passwordLabels} />
      default:
        return <Field {...fieldProps} type="text" />
    }
  }
}

AccountField.propTypes = {
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
    const { container, disabled, initialValues, manifestFields, t } = this.props

    // Ready to use named fields array
    const namedFields = Object.keys(manifestFields).map(fieldName => ({
      ...manifestFields[fieldName],
      name: fieldName
    }))

    return (
      <div>
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
  fillEncrypted: PropTypes.bool,
  manifestFields: PropTypes.object.isRequired,
  t: PropTypes.func
}

export class AccountForm extends PureComponent {
  constructor(props, context) {
    super(props, context)
    const { lang, locales } = props
    if (locales && lang) {
      extend(locales[lang])
    }
  }

  submitHandler(values, form) {
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
    const { fields, initialValues, oauth, onSubmit, submitting, t } = this.props

    if (oauth) return <OAuthForm initialValues={initialValues} oauth={oauth} />

    const sanitizedFields = Manifest.sanitizeFields(fields)
    const defaultValues = Manifest.defaultFieldsValues(sanitizedFields)

    const initialAndDefaultValues = { ...defaultValues, ...initialValues }

    let container = null

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
            <AccountFields
              container={container}
              disabled={submitting}
              initialValues={initialAndDefaultValues}
              manifestFields={sanitizedFields}
              t={t}
            />
            <Button
              busy={submitting}
              className="u-mt-2 u-mb-1-half"
              disabled={submitting || !valid || (initialValues && !dirty)}
              extension="full"
              label={t('accountForm.submit.label')}
              onClick={() => this.submitHandler(values, form)}
            />
          </div>
        )}
      />
    )
  }
}

AccountForm.propTypes = {
  account: PropTypes.object,
  fields: PropTypes.object,
  oauth: PropTypes.object,
  locales: PropTypes.object,
  submitting: PropTypes.bool
}

export default translate()(AccountForm)
