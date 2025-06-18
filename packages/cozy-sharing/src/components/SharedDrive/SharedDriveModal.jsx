import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedActionsDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { mergeAndDeduplicateRecipients, formatRecipients } from './helpers'
import withLocales from '../../hoc/withLocales'
import { useSharingContext } from '../../hooks/useSharingContext'
import { Contact } from '../../models'
import styles from '../../styles/shareddrive.styl'
import { default as DumbShareByEmail } from '../ShareByEmail'
import WhoHasAccess from '../WhoHasAccess'

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
  const [sharedDriveDescription, setSharedDriveDescription] = useState('')

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

  const handleSharedDriveDescriptionChange = event => {
    setSharedDriveDescription(event.target.value)
  }

  const onCreate = async () => {
    try {
      const { data: sharedDriveFolder } = await client.create('io.cozy.files', {
        name: sharedDriveName,
        dirId: 'io.cozy.files.shared-drives-dir',
        type: 'directory'
      })

      await share({
        document: sharedDriveFolder,
        recipients: sharedDriveRecipients.recipients,
        readOnlyRecipients: sharedDriveRecipients.readOnlyRecipients,
        description: sharedDriveDescription,
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

  const recipients = formatRecipients(sharedDriveRecipients)

  return (
    <FixedActionsDialog
      open
      onClose={onClose}
      title={t('SharedDrive.sharedDriveModal.title')}
      content={
        <div className="u-flex u-flex-column u-flex-items-center">
          <TextField
            required
            label={t('SharedDrive.sharedDriveModal.nameLabel')}
            variant="outlined"
            size="small"
            className="u-w-100 u-mt-1"
            value={sharedDriveName}
            onChange={handleSharedDriveNameChange}
          />
          <TextField
            required
            label={t('SharedDrive.sharedDriveModal.descriptionLabel')}
            variant="outlined"
            size="large"
            className="u-w-100 u-mt-1"
            value={sharedDriveDescription}
            onChange={handleSharedDriveDescriptionChange}
          />
          <div
            className={cx(
              'u-mt-1',
              styles['shared-drive-who-has-access-wrapper']
            )}
          >
            <Typography variant="h6" className="u-mb-1-half">
              {t('Share.contacts.whoHasAccess')}
            </Typography>
            <DumbShareByEmail
              createContact={contact => client.create(Contact.doctype, contact)}
              currentRecipients={[]}
              document={document}
              documentType="Files"
              onShare={onShare}
              submitLabel={t('SharedDrive.sharedDriveModal.add')}
              showNotifications={false}
            />
            <WhoHasAccess
              isOwner
              recipients={recipients}
              document={document}
              documentType="Files"
              className="u-w-100"
              onRevoke={onRevoke}
              onSetType={onSetType}
            />
          </div>
        </div>
      }
      actions={
        <>
          <Button
            variant="primary"
            label={t('SharedDrive.sharedDriveModal.create')}
            onClick={onCreate}
          />
        </>
      }
    />
  )
})

SharedDriveModal.propTypes = {
  onClose: PropTypes.func.isRequired
}
