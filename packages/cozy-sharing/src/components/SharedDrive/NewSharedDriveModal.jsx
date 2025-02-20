import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedActionsDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { mergeAndDeduplicateRecipients, formatRecipients } from './helpers'
import IllustrationSharedDrives from '../../assets/illustrations/illustration-shared-drives.svg'
import withLocales from '../../hoc/withLocales'
import { useSharingContext } from '../../hooks/useSharingContext'
import { Contact } from '../../models'
import styles from '../../styles/shareddrive.styl'
import { default as DumbShareByEmail } from '../ShareByEmail'
import WhoHasAccess from '../WhoHasAccess'

export const NewSharedDriveModal = withLocales(props => {
  const client = useClient()
  const { t } = useI18n()
  const { share } = useSharingContext()

  const [sharedDriveRecipients, setSharedDriveRecipients] = useState({
    recipients: [],
    readOnlyRecipients: []
  }) // manque un index
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
  }

  const recipients = formatRecipients(sharedDriveRecipients)

  return (
    <FixedActionsDialog
      open
      onClose={props.onClose}
      title={t('SharedDrive.newSharedDriveModal.title')}
      content={
        <div className={styles['shared-drive-content-wrapper']}>
          <IllustrationSharedDrives></IllustrationSharedDrives>
          <TextField
            required
            label={t('SharedDrive.newSharedDriveModal.nameLabel')}
            variant="outlined"
            size="small"
            className="u-w-100"
            value={sharedDriveName}
            onChange={handleSharedDriveNameChange}
          />
          <TextField
            required
            label={t('SharedDrive.newSharedDriveModal.descriptionLabel')}
            variant="outlined"
            size="large"
            className="u-w-100"
            value={sharedDriveDescription}
            onChange={handleSharedDriveDescriptionChange}
          />
          <Box className={styles['shared-drive-who-has-access-wrapper']}>
            <Typography variant="h6" className="u-mb-1-half">
              {t('Share.contacts.whoHasAccess')}
            </Typography>
            <DumbShareByEmail
              createContact={contact => client.create(Contact.doctype, contact)}
              currentRecipients={[]}
              document={document}
              documentType="Files"
              onShare={onShare}
              submitLabel={t('SharedDrive.newSharedDriveModal.add')}
              showNotifications={false}
            />
            <WhoHasAccess
              isOwner
              recipients={recipients}
              document={document}
              documentType="Files"
              className="u-w-100"
            />
          </Box>
        </div>
      }
      actions={
        <>
          <Button
            variant="primary"
            label={t('SharedDrive.newSharedDriveModal.create')}
            onClick={onCreate}
          />
        </>
      }
    />
  )
})

NewSharedDriveModal.propTypes = {
  onClose: PropTypes.func.isRequired
}
