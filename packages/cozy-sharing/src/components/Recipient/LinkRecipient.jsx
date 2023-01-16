import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import Circle from 'cozy-ui/transpiled/react/Circle'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Fade from 'cozy-ui/transpiled/react/Fade'

import { FADE_IN_DURATION } from '../../helpers/recipients'
import RecipientConfirm from './RecipientConfirm'
import LinkRecipientPermissions from './LinkRecipientPermissions'
import styles from './recipient.styl'

const LinkRecipient = props => {
  const { t } = useI18n()

  const { recipientConfirmationData, verifyRecipient, link, fadeIn } = props

  const RightPart = recipientConfirmationData ? (
    <RecipientConfirm
      recipientConfirmationData={recipientConfirmationData}
      verifyRecipient={verifyRecipient}
    ></RecipientConfirm>
  ) : (
    <LinkRecipientPermissions {...props} className="u-flex-shrink-0" />
  )

  return (
    <Fade in timeout={fadeIn ? FADE_IN_DURATION : 0}>
      <ListItem disableGutters>
        <ListItemIcon>
          <Circle size="small" className={styles['link-recipient-icon-circle']}>
            <Icon icon={LinkIcon} />
          </Circle>
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
    </Fade>
  )
}

LinkRecipient.propTypes = {
  link: PropTypes.string.isRequired
}

export default LinkRecipient
