import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'

import AssistantProvider, { useAssistant } from '../AssistantProvider'
import Conversation from '../Conversations/Conversation'
import ConversationBar from '../Conversations/ConversationBar'

import styles from '../Stylus/Conversation.styl'
import ConversationList from './ConversationList'

const ConversationLayout = ({ conversationId, assistantState }) => {
  const hasConversationStarted = assistantState && assistantState.messagesId.length > 0

  return (
    <div className={`${styles['conversationLayout']}`}>
      <div className={`u-flex u-flex-column u-flex-items-center u-flex-justify-center ${styles['conversationHistory']}`}>
        <ConversationList
          onNewConversation={() => { }}
        />
      </div>
      <div className={`${styles['conversationWindowContainer']}`}>
        <div className={`u-flex u-flex-column u-flex-items-center u-flex-justify-center ${styles['conversationWindow']}`}>
          <div className={`${styles['conversationContainer']} ${hasConversationStarted ? styles['conversationContainer--started'] : ''}`}>
            <Conversation id={conversationId} />
          </div>
          <ConversationBar assistantStatus={assistantState.status} hasConversationStarted={hasConversationStarted} />
        </div>
      </div>
    </div>
  )
}

export default ConversationLayout