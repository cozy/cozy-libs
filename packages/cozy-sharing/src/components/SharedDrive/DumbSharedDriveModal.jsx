import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import withLocales from '../../hoc/withLocales'
import { default as DumbShareByEmail } from '../ShareByEmail'
import WhoHasAccess from '../WhoHasAccess'

export const DumbSharedDriveModal = withLocales(
  ({
    title,
    document,
    sharedDriveName,
    handleSharedDriveNameChange,
    createContact,
    recipients,
    onRevoke,
    onSetType,
    onCreate,
    onClose,
    onShare
  }) => {
    const { t } = useI18n()

    return (
      <FixedDialog
        open
        disableGutters
        onClose={onClose}
        title={title}
        content={
          <div>
            <div className="u-ph-2">
              {handleSharedDriveNameChange && (
                <TextField
                  required
                  label={t('SharedDrive.sharedDriveModal.nameLabel')}
                  variant="outlined"
                  size="small"
                  className="u-w-100 u-mt-1-half"
                  value={sharedDriveName}
                  onChange={handleSharedDriveNameChange}
                />
              )}
              <Typography variant="h6" className="u-mt-1-half u-mb-half">
                {t('SharedDrive.sharedDriveModal.addPeople')}
              </Typography>
              <DumbShareByEmail
                createContact={createContact}
                currentRecipients={[]}
                document={document}
                documentType="Files"
                onShare={onShare}
                submitLabel={t('SharedDrive.sharedDriveModal.add')}
                showNotifications={false}
              />
            </div>
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
        }
        actions={
          <>
            {onCreate && (
              <>
                <Button
                  variant="secondary"
                  label={t('SharedDrive.sharedDriveModal.cancel')}
                  onClick={onClose}
                />
                <Button
                  variant="primary"
                  label={t('SharedDrive.sharedDriveModal.create')}
                  onClick={onCreate}
                />
              </>
            )}
          </>
        }
      />
    )
  }
)

DumbSharedDriveModal.propTypes = {
  title: PropTypes.string,
  document: PropTypes.object,
  sharedDriveName: PropTypes.string,
  handleSharedDriveNameChange: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired,
  recipients: PropTypes.array,
  onRevoke: PropTypes.func.isRequired,
  onSetType: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired
}
