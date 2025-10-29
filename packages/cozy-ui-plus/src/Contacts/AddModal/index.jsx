import React, { useState } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n, useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ContactForm, { getSubmitContactForm } from './ContactForm'
import { locales } from './locales'

const AddModal = ({
  contacts,
  contact,
  customFieldsProps,
  onSubmit,
  onClose
}) => {
  useExtendI18n(locales)
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const [isBusy, setIsBusy] = useState(false)
  // Tip to prevent fields from being filled with old information for a short period of time during form submission.
  const [selfContact, setSelfContact] = useState(contact)

  const handleClick = event => {
    const submitContactForm = getSubmitContactForm()
    submitContactForm(event)
  }

  /**
   * @param {import('cozy-client/types/types').IOCozyContact} formData - Contact document (except _id, _rev & _type attrs to create a new contact)
   */
  const handleFormSubmit = async formData => {
    setSelfContact(formData)
    setIsBusy(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      setIsBusy(false)
      console.warn(err) // eslint-disable-line no-console
      showAlert({
        severity: 'error',
        message: t('Contacts.AddModal.error.save')
      })
    }
  }

  return (
    <FixedDialog
      open
      onClose={onClose}
      title={
        contact
          ? t('Contacts.AddModal.edit-contact')
          : t('Contacts.AddModal.create_contact')
      }
      content={
        <ContactForm
          contacts={contacts}
          contact={selfContact}
          customFieldsProps={customFieldsProps}
          onSubmit={handleFormSubmit}
        />
      }
      actions={
        <>
          <Button
            variant="secondary"
            label={t('Contacts.AddModal.cancel')}
            onClick={onClose}
          />
          <Button
            className="u-ml-half"
            type="submit"
            label={t('Contacts.AddModal.save')}
            busy={isBusy}
            onClick={handleClick}
          />
        </>
      }
    />
  )
}

export default AddModal
