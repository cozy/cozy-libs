import cx from 'classnames'
import React from 'react'
import { FieldArray } from 'react-final-form-arrays'
import { useI18n, useExtendI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import CrossCircleIcon from 'cozy-ui/transpiled/react/Icons/CrossCircle'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'

import FieldInput from './FieldInput'
import { fieldsRequired, addField, removeField } from './helpers'
import { locales } from './locales'

const FieldInputArray = ({
  attributes: { name, label, ...restAttributes },
  contacts,
  formProps: { valid, submitFailed, errors }
}) => {
  useExtendI18n(locales)
  const { t } = useI18n()

  return (
    <FieldArray name={name}>
      {({ fields }) => {
        return (
          <>
            {fields.map((nameWithIndex, index) => {
              const key = fields.value[index]?.fieldId || nameWithIndex
              const showRemove = fields.value[index]?.[name]
              const inputName = `${nameWithIndex}.${name}`
              const isError =
                fieldsRequired.includes(inputName) && !valid && submitFailed

              return (
                <div
                  key={key}
                  className={cx('u-flex u-flex-items-baseline', {
                    'u-mt-1': index !== 0
                  })}
                >
                  <FieldInput
                    attributes={restAttributes}
                    contacts={contacts}
                    error={isError}
                    helperText={isError ? errors[inputName] : null}
                    name={inputName}
                    label={t(`Contacts.AddModal.ContactForm.fields.${name}`)}
                    labelProps={label}
                  />
                  {showRemove && (
                    <ListItemIcon className="u-ml-half">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        size="medium"
                        onClick={() => removeField(fields, index)}
                      >
                        <Icon icon={CrossCircleIcon} />
                      </IconButton>
                    </ListItemIcon>
                  )}
                </div>
              )
            })}
            <Button
              variant="text"
              startIcon={<Icon icon={PlusIcon} />}
              onClick={() => addField(fields)}
              label={t(`Contacts.AddModal.ContactForm.addLabel.${name}`)}
            />
          </>
        )
      }}
    </FieldArray>
  )
}

export default FieldInputArray
