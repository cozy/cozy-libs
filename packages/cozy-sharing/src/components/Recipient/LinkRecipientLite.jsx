import PropTypes from 'prop-types'
import React from 'react'

import Circle from 'cozy-ui/transpiled/react/Circle'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { checkIsReadOnlyPermissions } from '../../helpers/permissions'
import withLocales from '../../hoc/withLocales'
import styles from '../../styles/recipient.styl'

const LinkRecipientLite = ({ permissions, link }) => {
  const { t } = useI18n()

  if (!link) return null

  const isReadOnlyPermissions = checkIsReadOnlyPermissions(permissions)

  return (
    <ListItem size="small" ellipsis>
      <ListItemIcon>
        <Circle size="small" className={styles['link-recipient-icon-circle']}>
          <Icon icon={LinkIcon} />
        </Circle>
      </ListItemIcon>
      <ListItemText
        primary={t('Share.recipients.anyoneWithTheLink')}
        secondary={link}
      />
      <Typography className="u-flex-shrink-0" variant="body2">
        {t(
          `Share.type.${isReadOnlyPermissions ? 'one-way' : 'two-way'}`
        ).toLowerCase()}
      </Typography>
    </ListItem>
  )
}

LinkRecipientLite.propTypes = {
  permissions: PropTypes.array,
  link: PropTypes.string
}

export default withLocales(LinkRecipientLite)
