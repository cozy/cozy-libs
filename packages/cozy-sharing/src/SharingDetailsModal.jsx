import styles from './share.styl'
import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { CardDivider } from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { OwnerIdentity } from './components/Recipient'
import WhoHasAccess from './components/WhoHasAccess'
import { getDisplayName } from './models'

export const SharingDetailsModal = ({
  onClose,
  sharingType,
  owner,
  recipients,
  document,
  documentType = 'Document',
  onRevoke,
  onRevokeSelf
}) => {
  const { t, f } = useI18n()

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className={styles['share-modal']}
      title={t(`${documentType}.share.details.title`)}
      content={
        <div className={styles['share-modal-content']}>
          <div className={styles['share-details']}>
            <OwnerIdentity
              name={t(`${documentType}.share.sharedBy`, {
                name: getDisplayName(owner)
              })}
              url={owner.instance}
            />
            <div className={styles['share-details-created']}>
              {t(`${documentType}.share.details.createdAt`, {
                date: f(document.created_at || null, 'Do MMMM YYYY')
              })}
            </div>
            <div className={styles['share-details-perm']}>
              {t(
                `${documentType}.share.details.${
                  sharingType === 'one-way' ? 'ro' : 'rw'
                }`
              )}
            </div>
            <div className={styles['share-details-perm-desc']}>
              {t(
                `${documentType}.share.details.desc.${
                  sharingType === 'one-way' ? 'ro' : 'rw'
                }`
              )}
            </div>
          </div>
          <CardDivider />
          <WhoHasAccess
            title={t('Share.recipients.accessCount', {
              count: recipients.length
            })}
            recipients={recipients}
            document={document}
            documentType={documentType}
            onRevoke={onRevoke}
            onRevokeSelf={onRevokeSelf}
          />
        </div>
      }
    />
  )
}

SharingDetailsModal.propTypes = {
  onClose: PropTypes.func,
  sharingType: PropTypes.string,
  owner: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onRevokeSelf: PropTypes.func
}
export default SharingDetailsModal
