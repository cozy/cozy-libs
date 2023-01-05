import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import RecipientConfirm from './RecipientConfirm'
import LinkRecipientPermissions from './LinkRecipientPermissions'

import Typography from 'cozy-ui/transpiled/react/Typography'

const LinkRecipient = props => {
  const { t } = useI18n()

  const { recipientConfirmationData, verifyRecipient, link } = props

  const RightPart = recipientConfirmationData ? (
    <RecipientConfirm
      recipientConfirmationData={recipientConfirmationData}
      verifyRecipient={verifyRecipient}
    ></RecipientConfirm>
  ) : (
    <LinkRecipientPermissions {...props} className="u-flex-shrink-0" />
  )

  return (
    <ListItem disableGutters>
      <ListItemIcon>
        <Icon icon={LinkIcon} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography className="u-ellipsis" variant="body1">
            {t('Share.recipients.anyoneWithTheLink')}
          </Typography>
        }
        secondary={link}
      />
      {RightPart}
    </ListItem>
  )
}

LinkRecipient.propTypes = {
  link: PropTypes.string.isRequired
}

export default LinkRecipient
