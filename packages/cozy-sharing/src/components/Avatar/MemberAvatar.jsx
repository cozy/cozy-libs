import React from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'

import logger from '../../logger'
import { getInitials } from '../../models'

const MemberAvatar = ({ recipient, ...rest }) => {
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
   * can be different since the stack generate it on the fly
   * because they can be customized by the user.
   * It can be "gray" during the first load depending of the
   * status' sharing, but can become active (from the realtime)
   * so we need a way to "refresh" the image. Passing the
   * status in the url force the refresh of the image when the
   * status changes
   */
  // we comment this part for now because it's not compliant with Twake theme
  // const image =
  //   recipient.avatarPath && recipient.status
  //     ? `${client.options.uri}${recipient.avatarPath}?v=${recipient.status}`
  //     : null

  return (
    <Avatar
      // image={image}
      border
      disabled={
        recipient.status === 'pending' || recipient.status === 'mail-not-send'
      }
      {...rest}
    >
      {getInitials(recipient)}
    </Avatar>
  )
}

export { MemberAvatar }
