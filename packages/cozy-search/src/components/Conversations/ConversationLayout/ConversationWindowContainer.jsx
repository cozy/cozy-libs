import React from 'react'

import Conversation from '../../Conversations/Conversation'
import ConversationBar from '../../Conversations/ConversationBar'
import styles from '../../Stylus/Conversation.styl'

const ConversationWindowContainer = ({
  conversationId,
  assistantState,
  hasConversationStarted
}) => {
  return (
    <div className={`${styles['conversationWindowContainer']}`}>
      <div
        className={`u-flex u-flex-column u-flex-items-center u-flex-justify-center ${styles['conversationWindow']}`}
      >
        <div
          className={`${styles['conversationContainer']} ${
            hasConversationStarted
              ? styles['conversationContainer--started']
              : ''
          }`}
        >
          <Conversation id={conversationId} />
        </div>
        <ConversationBar
          assistantStatus={assistantState.status}
          hasConversationStarted={hasConversationStarted}
        />
      </div>
    </div>
  )
}

export default ConversationWindowContainer
