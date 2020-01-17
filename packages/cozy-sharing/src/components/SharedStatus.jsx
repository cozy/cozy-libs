import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import cx from 'classnames'

import { Contact } from '../models'
import styles from './status.styl'
import LinkIcon from '../../assets/icons/icon-link.svg'

const SharedStatus = ({ className, docId, recipients, link, t }) => (
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
    {link && <LinkIcon />}
  </span>
)

export default translate()(SharedStatus)
