import React from 'react'

import { useClient } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/legacy/Avatar'

import logger from '../../logger'
import { getDisplayName, getInitials } from '../../models'

const MemberAvatar = ({ recipient, ...rest }) => {
  const client = useClient()

  // There are cases when due to apparent memory leaks, the recipient does not exist
  // This will trigger an unhanded error in the Avatar component and crash the app
  // At the moment, we are not sure where is the root cause of this cascading undefined props
  // Nevertheless, we can prevent the crash by returning null if the recipient is undefined
  if (!recipient) {
    // eslint-disable-next-line
    logger.warn('RecipientAvatar: recipient is missing, see props:', { recipient, ...rest })
    return null
  }

  /**
   * avatarPath is always the same for a recipient, but image
   * can be different since the stack generate it on the fly.
   * It can be "gray" during the first load depending of the
   * status' sharing, but can become active (from the realtime)
   * so we need a way to "refresh" the image. Passing the
   * status in the url force the refresh of the image when the
   * status changes
   */
  const image =
    recipient.avatarPath && recipient.status
      ? `${client.options.uri}${recipient.avatarPath}?v=${recipient.status}`
      : null

  return (
    <Avatar
      image={image}
      text={getInitials(recipient)}
      textId={getDisplayName(recipient)}
      disabled={
        recipient.status === 'pending' || recipient.status === 'mail-not-send'
      }
      {...rest}
    />
  )
}

export { MemberAvatar }
