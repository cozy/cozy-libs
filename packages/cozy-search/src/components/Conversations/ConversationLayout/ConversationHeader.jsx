import React from 'react'

import AppTitle from 'cozy-ui/transpiled/react/AppTitle'

import styles from '../../Stylus/Conversation.styl'

const ConversationHeader = () => {
  return (
    <div className={`${styles['conversationHeader']}`}>
      <AppTitle slug="home" />
    </div>
  )
}

export default ConversationHeader
