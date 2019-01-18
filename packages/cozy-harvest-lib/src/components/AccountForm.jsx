import React, { PureComponent } from 'react'
import { Form, Field as FinalFormField } from 'react-final-form'
import PropTypes from 'react-proptypes'

import Button from 'cozy-ui/react/Button'
import { translate, extend } from 'cozy-ui/react/I18n'
import Field from 'cozy-ui/react/Field'

import { sanitizeSelectProps } from '../helpers/fields'
import Manifest from '../Manifest'
import OAuthForm from './OAuthForm'

const ENCRYPTED_PLACEHOLDER = '*************'

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

const VALIDATION_ERROR_REQUIRED_FIELD = 'VALIDATION_ERROR_REQUIRED_FIELD'

export class AccountField extends PureComponent {
  render() {
    const { initialValue, label, name, placeholder, role, t, type } = this.props

    // Allow manifest to specify predefined label
    const localeKey = predefinedLabels.includes(label) ? label : name

    const isEditable = !(role === 'identifier' && initialValue)

    const fieldProps = {
      ...this.props,
      className: 'u-m-0', // 0 margin
      disabled: !isEditable,
      fullwidth: true,
      label: t(`fields.${localeKey}.label`, { _: name }),
      placeholder: placeholder || t(`fields.${name}.placeholder`, { _: '' }),
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
    const { fillEncrypted, initialValues, manifestFields, t } = this.props

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
                initialValue={initialValues[field.name]}
                placeholder={
                  field.encrypted && fillEncrypted && ENCRYPTED_PLACEHOLDER
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

  validate = fields => vals => {
    let errors = {}
    for (let name in fields)
      if (fields[name].required && !vals[name])
        errors[name] = VALIDATION_ERROR_REQUIRED_FIELD
    return errors
  }

  render() {
    const { fields, initialValues, oauth, t } = this.props

    if (oauth) return <OAuthForm oauth={oauth} />

    const sanitizedFields = Manifest.sanitizeFields(fields)
    const defaultValues = Manifest.defaultFieldsValues(sanitizedFields)

    const initialAndDefaultValues = { ...defaultValues, ...initialValues }

    return (
      <Form
        initialValues={initialAndDefaultValues}
        // eslint-disable-next-line no-console
        onSubmit={v => console.log(v)}
        validate={this.validate(sanitizedFields)}
        render={({ values, valid }) => (
          <div>
            <AccountFields
              initialValues={initialAndDefaultValues}
              fillEncrypted={!!initialValues}
              manifestFields={sanitizedFields}
              t={t}
            />
            <Button
              className="u-mt-2 u-mb-1-half"
              disabled={!valid}
              extension="full"
              label={t('accountForm.submit.label')}
              onclick={() => alert(JSON.stringify(values, 0, 2))}
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
  locales: PropTypes.object
}

export default translate()(AccountForm)
