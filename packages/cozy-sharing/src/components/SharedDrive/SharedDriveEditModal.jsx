import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { DumbSharedDriveModal } from './DumbSharedDriveModal'
import withLocales from '../../hoc/withLocales'
import { Contact } from '../../models'

export const SharedDriveEditModal = withLocales(
  ({ document, sharing, recipients, onShare, onRevoke, onClose }) => {
    const client = useClient()
    const { t } = useI18n()
    const { showAlert } = useAlert()

    const createContact = contact => client.create(Contact.doctype, contact)
    const [name, setName] = useState(sharing?.description)

    const handleNameChange = event => {
      setName(event.target.value)
    }
    const onRename = async value => {
      try {
        await client
          .collection('io.cozy.sharings')
          .renameSharedDrive(sharing, value)
        showAlert({
          message: t('SharedDrive.sharedDriveModal.successNotificationUpdate'),
          severity: 'success'
        })
        onClose()
      } catch (error) {
        showAlert({
          message: t('SharedDrive.sharedDriveModal.errorNotificationUpdate'),
          severity: 'error'
        })
      }
    }

    return (
      <DumbSharedDriveModal
        title={t('Files.share.title', { name: sharing?.description })}
        document={document}
        createContact={createContact}
        recipients={recipients}
        onRevoke={onRevoke}
        onClose={onClose}
        onShare={onShare}
        sharedDriveName={name}
        handleSharedDriveNameChange={handleNameChange}
        onRename={onRename}
        originalSharedDriveName={sharing?.description}
      />
    )
  }
)

SharedDriveEditModal.propTypes = {
  onClose: PropTypes.func.isRequired
}
