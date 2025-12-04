import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { DumbSharedDriveModal } from './DumbSharedDriveModal'
import { mergeAndDeduplicateRecipients, formatRecipients } from './helpers'
import withLocales from '../../hoc/withLocales'
import { useSharingContext } from '../../hooks/useSharingContext'
import { Contact } from '../../models'

export const SharedDriveModal = withLocales(({ onClose }) => {
  const client = useClient()
  const { t } = useI18n()
  const { share } = useSharingContext()
  const { showAlert } = useAlert()

  const [sharedDriveRecipients, setSharedDriveRecipients] = useState({
    recipients: [],
    readOnlyRecipients: []
  })
  const [sharedDriveName, setSharedDriveName] = useState('')

  const onShare = params => {
    setSharedDriveRecipients({
      recipients: mergeAndDeduplicateRecipients([
        sharedDriveRecipients.recipients,
        params.recipients
      ]),
      readOnlyRecipients: mergeAndDeduplicateRecipients([
        sharedDriveRecipients.readOnlyRecipients,
        params.readOnlyRecipients
      ])
    })
  }

  const handleSharedDriveNameChange = event => {
    setSharedDriveName(event.target.value)
  }

  const onCreate = async () => {
    try {
      await client
        .collection('io.cozy.files')
        .getOrCreateSharedDrivesDirectory()
      const { data: sharedDriveFolder } = await client.create('io.cozy.files', {
        name: sharedDriveName,
        dirId: 'io.cozy.files.shared-drives-dir',
        type: 'directory'
      })

      await share({
        description: sharedDriveName,
        document: sharedDriveFolder,
        recipients: sharedDriveRecipients.recipients,
        readOnlyRecipients: sharedDriveRecipients.readOnlyRecipients,
        sharedDrive: true
      })

      showAlert({
        message: t('SharedDrive.sharedDriveModal.successNotification'),
        severity: 'success',
        variant: 'filled'
      })

      onClose()
    } catch (err) {
      showAlert({
        message: t('SharedDrive.sharedDriveModal.errorNotification'),
        severity: 'error',
        variant: 'filled'
      })
    }
  }

  const onSetType = (index, newType) => {
    const _id = index.split('virtual-shared-drive-sharing-')[1]

    if (newType === 'two-way') {
      setSharedDriveRecipients(prev => {
        const recipientToMove = prev.readOnlyRecipients.find(r => r._id === _id)

        return {
          recipients: [...prev.recipients, recipientToMove],
          readOnlyRecipients: prev.readOnlyRecipients.filter(r => r._id !== _id)
        }
      })
    } else {
      setSharedDriveRecipients(prev => {
        const recipientToMove = prev.recipients.find(r => r._id === _id)

        return {
          recipients: prev.recipients.filter(r => r._id !== _id),
          readOnlyRecipients: [...prev.readOnlyRecipients, recipientToMove]
        }
      })
    }
  }

  const onRevoke = index => {
    const _id = index.split('virtual-shared-drive-sharing-')[1]

    setSharedDriveRecipients(prev => {
      return {
        recipients: prev.recipients.filter(r => r._id !== _id),
        readOnlyRecipients: prev.readOnlyRecipients.filter(r => r._id !== _id)
      }
    })
  }

  const createContact = contact => client.create(Contact.doctype, contact)

  const recipients = formatRecipients(sharedDriveRecipients)

  return (
    <DumbSharedDriveModal
      title={t('SharedDrive.sharedDriveModal.title')}
      sharedDriveName={sharedDriveName}
      handleSharedDriveNameChange={handleSharedDriveNameChange}
      createContact={createContact}
      recipients={recipients}
      onRevoke={onRevoke}
      onSetType={onSetType}
      onCreate={onCreate}
      onClose={onClose}
      onShare={onShare}
    />
  )
})

SharedDriveModal.propTypes = {
  onClose: PropTypes.func.isRequired
}
