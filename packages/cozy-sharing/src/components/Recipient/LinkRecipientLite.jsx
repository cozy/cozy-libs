import PropTypes from 'prop-types'
import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { checkIsReadOnlyPermissions } from '../../helpers/permissions'
import withLocales from '../../hoc/withLocales'

const LinkRecipientLite = ({ permissions, link }) => {
  const { t } = useI18n()

  if (!link) return null

  const isReadOnlyPermissions = checkIsReadOnlyPermissions(permissions)

  return (
    <ListItem size="small" ellipsis>
      <ListItemIcon>
        <Avatar size="m" color="none" border innerBorder={isTwakeTheme()}>
          <Icon icon={LinkIcon} />
        </Avatar>
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
