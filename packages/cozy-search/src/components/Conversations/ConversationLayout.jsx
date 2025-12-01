import React, { useState } from 'react'

import { useQuery } from 'cozy-client'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { buildChatConversationQueryById } from '../queries'
import ConversationHeader from './ConversationLayout/ConversationHeader'
import ConversationHistory from './ConversationLayout/ConversationHistory'
import ConversationSwitcher from './ConversationLayout/ConversationSwitcher'
import ConversationWindowContainer from './ConversationLayout/ConversationWindowContainer'
import styles from '../Stylus/Conversation.styl'

const ConversationLayout = ({ conversationId, assistantState }) => {
  const { isMobile } = useBreakpoints()

  const chatConversationQuery = buildChatConversationQueryById(
    conversationId ?? ''
  )
  const { data: chatConversation } = useQuery(
    chatConversationQuery.definition,
    chatConversationQuery.options
  )

  const hasConversationStarted =
    chatConversation && chatConversation.messages.length > 0
  const [historyOpen, setHistoryOpen] = useState(!isMobile)

  return (
    <div className={`${styles['conversationApp']}`}>
      <ConversationHeader />

      <div className={`${styles['conversationLayout']}`}>
        <ConversationSwitcher
          historyOpen={historyOpen}
          setHistoryOpen={setHistoryOpen}
        />

        <ConversationHistory
          conversationId={conversationId}
          historyOpen={historyOpen}
          isMobile={isMobile}
        />
        <ConversationWindowContainer
          conversationId={conversationId}
          assistantState={assistantState}
          hasConversationStarted={hasConversationStarted}
        />
      </div>
    </div>
  )
}

export default ConversationLayout
