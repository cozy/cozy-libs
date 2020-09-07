import styles from './share.styl'
import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/transpiled/react/Modal'

import { OwnerIdentity } from './components/Recipient'
import WhoHasAccess from './components/WhoHasAccess'
import { Contact } from './models'

export const SharingDetailsModal = ({
  onClose,
  sharingType,
  owner,
  recipients,
  document,
  documentType = 'Document',
  onRevoke,
  onRevokeSelf,
  t,
  f
}) => {
  return (
    <Modal
      title={t(`${documentType}.share.details.title`)}
      dismissAction={onClose}
      className={styles['share-modal']}
      into="body"
      size="small"
      mobileFullscreen
    >
      <ModalContent className={styles['share-modal-content']}>
        <div className={styles['share-details']}>
          <OwnerIdentity
            name={t(`${documentType}.share.sharedBy`, {
              name: Contact.getDisplayName(owner)
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
        <hr className={styles['divider']} />
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
      </ModalContent>
    </Modal>
  )
}

SharingDetailsModal.propTypes = {
  onClose: PropTypes.func,
  sharingType: PropTypes.string,
  owner: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  onRevoke: PropTypes.func.isRequired,
  onRevokeSelf: PropTypes.func,
  f: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}
export default translate()(SharingDetailsModal)
