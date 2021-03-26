import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Field as FinalFormField } from 'react-final-form'
import get from 'lodash/get'

import AccountField from './AccountField'
import { getEncryptedFieldName } from '../../helpers/fields'

// As SelectBox component from Cozy-UI, rendering dropdown type, is just giving
// us the full Option object, we just get its value to facilitate mapping
// with account
const parse = type => value => {
  return type === 'dropdown' ? value.value : value
}

/**
 * Renders a list of AccountField, encapsulating them in a Field component from
 * ReactFinalForm.
 * @type {PureComponent}
 * @see https://github.com/final-form/react-final-form#field--reactcomponenttypefieldpropss
 */
export class AccountFields extends PureComponent {
  render() {
    const {
      container,
      disabled,
      fields,
      hasError,
      initialValues = {},
      inputRefByName,
      t
    } = this.props

    // Ready to use named fields array
    const namedFields = Object.keys(fields).map(fieldName => ({
      ...fields[fieldName],
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
            {({ input }) => {
              const forceEncryptedPlaceholder = get(
                field,
                'forceEncryptedPlaceholder'
              )
              return (
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
                  inputRef={inputRefByName(field.name)}
                  forceEncryptedPlaceholder={forceEncryptedPlaceholder}
                  t={t}
                />
              )
            }}
          </FinalFormField>
        ))}
      </div>
    )
  }
}

AccountFields.propTypes = {
  /**
   * The element wrapping the <AccountFields /> component.
   * Passed to <Field /> component.
   */
  container: PropTypes.instanceOf(Element),
  /**
   * Indicates if all the fields are disabled
   * @type {Boolean}
   */
  disabled: PropTypes.bool,
  /**
   * The sanitized konnector.fields object used do define the form fields
   * @type {object}
   */
  fields: PropTypes.object.isRequired,
  /**
   * Indicites if all the fields should be rendered as errored
   * @type {Boolean}
   */
  hasError: PropTypes.bool,
  /**
   * Initial data as key/value pairs
   * @type {Object}
   */
  initialValues: PropTypes.object,
  /**
   * A callback, which call with a name should return another callback to handle
   * react ref to Field input element.
   * @type {Function}
   */
  inputRefByName: PropTypes.func
}

export default AccountFields
