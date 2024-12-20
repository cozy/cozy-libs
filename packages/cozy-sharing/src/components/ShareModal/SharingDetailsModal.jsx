import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/Divider'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getDisplayName } from '../../models'
import styles from '../../styles/share.styl'
import OwnerIdentity from '../Identity/OwnerIdentity'
import WhoHasAccess from '../WhoHasAccess'

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
  const { isMobile } = useBreakpoints()

  return (
    <Dialog
      disableGutters
      open={true}
      onClose={onClose}
      className={styles['share-modal']}
      title={t(`${documentType}.share.details.title`)}
      content={
        <div className={styles['share-modal-content']}>
          <div
            className={cx(
              styles['share-details'],
              isMobile ? 'u-ph-1 u-pt-1-half' : 'u-ph-2 u-pt-1'
            )}
          >
            <OwnerIdentity
              name={t(`${documentType}.share.sharedBy`, {
                name: getDisplayName(owner)
              })}
              url={owner.instance}
            />
            <div className={styles['share-details-created']}>
              {t(`${documentType}.share.details.createdAt`, {
                date: f(document.created_at || null, 'do LLLL yyyy')
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
          <Divider className="u-mv-1" />
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
