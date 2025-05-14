import PropTypes from 'prop-types'
import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Fade from 'cozy-ui/transpiled/react/Fade'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkIcon from 'cozy-ui/transpiled/react/Icons/Link'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import LinkRecipientPermissions from './LinkRecipientPermissions'
import RecipientConfirm from './RecipientConfirm'
import {
  checkIsPermissionHasPassword,
  getPermissionExpiresDate
} from '../../helpers/permissions'
import { FADE_IN_DURATION } from '../../helpers/recipients'
import { useSharingContext } from '../../hooks/useSharingContext'

const LinkRecipient = props => {
  const { t, f, lang } = useI18n()
  const { isMobile } = useBreakpoints()
  const { getDocumentPermissions } = useSharingContext()

  const { recipientConfirmationData, verifyRecipient, link, fadeIn, document } =
    props

  const permissions = getDocumentPermissions(document._id)
  const hasPassword = checkIsPermissionHasPassword(permissions)
  const expiresDate = getPermissionExpiresDate(permissions)
  const dateFormatted = expiresDate
    ? f(expiresDate, lang === 'fr' ? 'dd/LL/yyyy' : 'LL/dd/yyyy')
    : null

  const textPrimary = hasPassword
    ? t('Share.recipients.linkWithPassword')
    : t('Share.recipients.anyoneWithTheLink')

  const textSecondary = expiresDate
    ? t('Share.recipients.expires', {
        date: dateFormatted
      })
    : link

  const RightPart = recipientConfirmationData ? (
    <RecipientConfirm
      recipientConfirmationData={recipientConfirmationData}
      verifyRecipient={verifyRecipient}
    />
  ) : (
    <LinkRecipientPermissions {...props} className="u-flex-shrink-0" />
  )

  return (
    <Fade in timeout={fadeIn ? FADE_IN_DURATION : 0}>
      <ListItem gutters={isMobile ? 'default' : 'double'} size="small">
        <ListItemIcon>
          <Avatar size="m" color="none" border innerBorder>
            <Icon icon={LinkIcon} />
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="body1">{textPrimary}</Typography>}
          secondary={textSecondary}
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
