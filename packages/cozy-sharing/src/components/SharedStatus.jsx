import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import palette from 'cozy-ui/transpiled/react/palette'
import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import cx from 'classnames'

import { Contact } from '../models'
import styles from './status.styl'
import LinkIcon from '../../assets/icons/icon-link.svg'

export const SharedStatus = ({ className, docId, recipients, link, t }) => (
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
            Contact.getDisplayName(recipient)
          )}
        />
      </SharingTooltip>
    )}
    {link && (
      <>
        <LinkIcon
          style={{ fill: palette.coolGrey }}
          data-tip
          data-for={`linkfor${docId}`}
        />

        <SharingTooltip id={`linkfor${docId}`}>
          <span>{t('Files.share.shareByLink.subtitle')}</span>
        </SharingTooltip>
      </>
    )}
  </span>
)

export default translate()(SharedStatus)
