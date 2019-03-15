import PropTypes from 'react-proptypes'
import React, { PureComponent } from 'react'
import { Field as FinalFormField } from 'react-final-form'

import AccountField from './AccountField'
import { getEncryptedFieldName } from '../../helpers/fields'

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
      manifestFields
    } = this.props

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
                hasError={hasError}
                disabled={disabled}
                initialValue={
                  initialValues[field.name] ||
                  initialValues[getEncryptedFieldName(field.name)]
                }
              />
            )}
          </FinalFormField>
        ))}
      </div>
    )
  }
}

AccountFields.propTypes = {
  container: PropTypes.node,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  manifestFields: PropTypes.object.isRequired
}

export default AccountFields
