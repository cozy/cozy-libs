import React, { PureComponent } from 'react'
import { Form, Field as FinalFormField } from 'react-final-form'
import PropTypes from 'react-proptypes'

import Button from 'cozy-ui/react/Button'
import { translate, extend } from 'cozy-ui/react/I18n'
import Field from 'cozy-ui/react/Field'

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

export class AccountField extends PureComponent {
  render() {
    const { label, name, t, type } = this.props

    // Allow manifest to specify predefined label
    const localeKey = predefinedLabels.includes(label) ? label : name

    const fieldProps = {
      ...this.props,
      className: 'u-m-0', // 0 margin
      fullwidth: true,
      label: t(`fields.${localeKey}.label`, { _: name }),
      size: 'medium'
    }
    const passwordLabels = {
      hideLabel: t('accountForm.password.hide'),
      showLabel: t('accountForm.password.show')
    }
    switch (type) {
      case 'dropdown':
        return (
          <Field
            {...fieldProps}
            options={fieldProps.options.map(option => ({
              ...option,
              // legacy
              label: option.name
            }))}
            value={fieldProps.options.find(o => o.value === fieldProps.value)}
            type="select"
          />
        )
      case 'password':
        return <Field {...fieldProps} secondaryLabels={passwordLabels} />
      default:
        return <Field {...fieldProps} type="text" />
    }
  }
}

// As SelectBox component from Cozy-UI, rendering dropdown type, is just giving
// us the full Option object, we just get its value to facilitate mapping
// with account
const parse = type => value => {
  return type === 'dropdown' ? value.value : value
}

export class AccountFields extends PureComponent {
  render() {
    const { fillEncrypted, manifestFields, t } = this.props

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
                placeholder={
                  field.encrypted && fillEncrypted
                    ? ENCRYPTED_PLACEHOLDER
                    : field.placeholder
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

export class AccountForm extends PureComponent {
  constructor(props, context) {
    super(props, context)
    const { lang, locales } = props
    if (locales && lang) {
      extend(locales[lang])
    }
  }

  render() {
    const { account, fields, oauth, t } = this.props

    if (oauth) return <OAuthForm oauth={oauth} />

    const sanitizedFields = Manifest.sanitizeFields(fields)
    const initialValues = account ? account.auth : {}
    return (
      <Form
        initialValues={initialValues}
        // eslint-disable-next-line no-console
        onSubmit={v => console.log(v)}
        render={({ values }) => (
          <div>
            <AccountFields
              fillEncrypted={!!account}
              manifestFields={sanitizedFields}
              t={t}
            />
            <Button
              className="u-mt-2 u-mb-1-half"
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
  fields: PropTypes.object.isRequired,
  locales: PropTypes.object
}

export default translate()(AccountForm)
