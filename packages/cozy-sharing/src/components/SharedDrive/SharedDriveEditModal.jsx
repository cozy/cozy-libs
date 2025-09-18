import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { DumbSharedDriveModal } from './DumbSharedDriveModal'
import withLocales from '../../hoc/withLocales'
import { Contact } from '../../models'

export const SharedDriveEditModal = withLocales(
  ({ document, sharing, recipients, onShare, onRevoke, onClose }) => {
    const client = useClient()
    const { t } = useI18n()

    const createContact = contact => client.create(Contact.doctype, contact)

    return (
      <DumbSharedDriveModal
        title={t('Files.share.title', { name: sharing?.description })}
        document={document}
        createContact={createContact}
        recipients={recipients}
        onRevoke={onRevoke}
        onClose={onClose}
        onShare={onShare}
      />
    )
  }
)

SharedDriveEditModal.propTypes = {
  onClose: PropTypes.func.isRequired
}
