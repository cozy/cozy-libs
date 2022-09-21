import React, { useState } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { useScannerI18n } from '../../Hooks/useScannerI18n'
import CompositeHeaderImage from '../../CompositeHeader/CompositeHeaderImage'
import IlluGenericInputText from '../../../assets/icons/IlluGenericInputText.svg'
import ContactEditList from './ContactEditList'

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
