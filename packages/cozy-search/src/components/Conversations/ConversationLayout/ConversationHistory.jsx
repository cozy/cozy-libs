import React from 'react'

import styles from '../../Stylus/Conversation.styl'
import ConversationList from '../ConversationList'

const ConversationHistory = ({ conversationId, historyOpen, isMobile }) => {
  return (
    <div
      className={`u-flex u-flex-column u-flex-items-center u-flex-justify-center ${
        styles['conversationHistory']
      } ${historyOpen ? styles['conversationHistory--open'] : ''} ${
        isMobile ? styles['conversationHistory--mobile'] : ''
      }`}
    >
      <ConversationList onNewConversation={() => {}} id={conversationId} />
    </div>
  )
}

export default ConversationHistory
