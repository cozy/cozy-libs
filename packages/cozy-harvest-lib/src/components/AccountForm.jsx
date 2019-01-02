import React, { PureComponent } from 'react'
import { Form, Field as FinalFormField } from 'react-final-form'

import Button from 'cozy-ui/react/Button'
import Field from 'cozy-ui/react/Field'

import Manifest from '../Manifest'

export class AccountField extends PureComponent {
  render() {
    const { type } = this.props
    const fieldProps = {
      className: 'u-m-0', // 0 margin
      size: 'medium'
    }
    switch (type) {
      case 'password':
        return <Field {...this.props} {...fieldProps} />
      default:
        return <Field {...this.props} {...fieldProps} type="text" />
    }
  }
}

export class AccountFields extends PureComponent {
  render() {
    const { manifestFields } = this.props

    // Ready to use named fields array
    const namedFields = Object.keys(manifestFields).map(fieldName => ({
      ...manifestFields[fieldName],
      name: fieldName
    }))

    return (
      <div>
        {namedFields.map((field, index) => (
          <FinalFormField key={index} name={field.name}>
            {({ input }) => (
              <AccountField label={field.name} {...field} {...input} />
            )}
          </FinalFormField>
        ))}
      </div>
    )
  }
}

export class AccountForm extends PureComponent {
  render() {
    const { fields } = this.props
    const sanitizedFields = Manifest.sanitizeFields(fields)
    return (
      <Form
        // eslint-disable-next-line no-console
        onSubmit={v => console.log(v)}
        render={({ values }) => (
          <div>
            <AccountFields manifestFields={sanitizedFields} />
            <Button
              className="u-mt-2 u-mb-1-half"
              onclick={() => alert(JSON.stringify(values, 0, 2))}
              extension="full"
            >
              Submit
            </Button>
          </div>
        )}
      />
    )
  }
}

export default AccountForm
