import React from 'react'

import { getDisplayName, getInitials } from 'cozy-client/dist/models/contact'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ChatItem from './ChatItem'

const ChatUserItem = ({ className, label, myself, ...props }) => {
  const { t } = useI18n()

  const contact = myself || { displayName: t('assistant.default_username') }

  return (
    <ChatItem
      {...props}
      className={className}
      icon={<Avatar text={getInitials(contact)} size={24} />}
      name={getDisplayName(contact)}
      label={label}
    />
  )
}

export default ChatUserItem
