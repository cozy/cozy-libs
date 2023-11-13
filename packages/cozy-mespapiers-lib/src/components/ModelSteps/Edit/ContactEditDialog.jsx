import React, { useState } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ContactEditList from './ContactEditList'
import IlluGenericInputText from '../../../assets/icons/IlluGenericInputText.svg'
import CompositeHeaderImage from '../../CompositeHeader/CompositeHeaderImage'
import { useScannerI18n } from '../../Hooks/useScannerI18n'

const ContactEditDialog = ({
  isBusy,
  currentEditInformation,
  contacts,
  onConfirm,
  onClose
}) => {
  const { t } = useI18n()
  const scannerT = useScannerI18n()

  const [contactsList, setContactsList] = useState(contacts)
  const [contactIdsSelected, setContactIdsSelected] = useState(
    contacts.map(contact => contact._id)
  )

  const dialogTitle = currentEditInformation?.paperDef?.label
    ? scannerT(`items.${currentEditInformation.paperDef.label}`)
    : ''

  const isMultipleContactAllowed =
    currentEditInformation.currentStep?.multiple ?? false

  const text = currentEditInformation.currentStep?.text
    ? t(currentEditInformation.currentStep.text)
    : null

  return (
    <Dialog
      open
      onClose={onClose}
      title={dialogTitle}
      content={
        <>
          <CompositeHeaderImage
            icon={currentEditInformation.currentStep?.illustration}
            fallbackIcon={IlluGenericInputText}
            iconSize="medium"
          />
          {text && (
            <Typography variant="h5" className="u-ta-center">
              {text}
            </Typography>
          )}
          <ContactEditList
            contactsList={contactsList}
            setContactsList={setContactsList}
            contactIdsSelected={contactIdsSelected}
            setContactIdsSelected={setContactIdsSelected}
            isMultiple={isMultipleContactAllowed}
          />
        </>
      }
      actions={
        <Button
          label={t('common.apply')}
          onClick={() => onConfirm(contactIdsSelected)}
          fullWidth
          disabled={contactIdsSelected.length === 0}
          busy={isBusy}
        />
      }
    />
  )
}

export default ContactEditDialog
