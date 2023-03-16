import React from 'react'

import { useClient } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/Avatar'

import { getDisplayName, getInitials } from '../../models'

const RecipientAvatar = ({ recipient, ...rest }) => {
  const client = useClient()

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

export default RecipientAvatar
