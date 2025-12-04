import cx from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import LinkIcon from '../assets/icons/icon-link.svg'
import { getDisplayName } from '../models'
import styles from '../styles/status.styl'

export const SharedStatus = ({ className, docId, recipients, link }) => {
  const { t } = useI18n()
  return (
    <span className={cx(className, styles['shared-status'])}>
      {recipients.length > 1 && (
        <a
          data-tip
          data-for={`members${docId}`}
          className={styles['shared-status-label']}
        >
          {t('Share.members.count', { smart_count: recipients.length })}
        </a>
      )}
      {recipients.length > 1 && (
        <SharingTooltip id={`members${docId}`}>
          <TooltipRecipientList
            recipientNames={recipients.map(recipient =>
              getDisplayName(recipient)
            )}
          />
        </SharingTooltip>
      )}
      {link && (
        <>
          <LinkIcon
            style={{ fill: 'var(--iconTextColor)' }}
            data-tip
            data-for={`linkfor${docId}`}
          />

          <SharingTooltip id={`linkfor${docId}`}>
            <span>{t('Files.share.sharedByLink')}</span>
          </SharingTooltip>
        </>
      )}
    </span>
  )
}

export default SharedStatus
