import React, { useState } from 'react'

import { useQuery } from 'cozy-client'
import flag from 'cozy-flags'
import AppTitle from 'cozy-ui/transpiled/react/AppTitle'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import ConversationList from './ConversationList'
import Conversation from '../Conversations/Conversation'
import ConversationBar from '../Conversations/ConversationBar'
import styles from '../Stylus/Conversation.styl'
import { buildChatConversationQueryById } from '../queries'

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
      <div className={`${styles['conversationHeader']}`}>
        <AppTitle slug="home" />
      </div>

      <div className={`${styles['conversationLayout']}`}>
        <div
          className={`${styles['conversationSwitcher']} ${
            historyOpen
              ? styles['conversationSwitcher--open']
              : styles['conversationSwitcher--closed']
          }`}
        >
          <Button
            label={<Icon icon="burger" />}
            onClick={() => {
              setHistoryOpen(!historyOpen)
            }}
            variant={historyOpen ? 'ghost' : 'text'}
            className="u-bdrs-4"
            style={{ padding: 0, minWidth: 36, height: 30 }}
          />

          {flag('cozy.assistant.demo') && (
            <Button
              label={<Icon icon="magnifier" />}
              variant="text"
              className="u-bdrs-4"
              style={{ padding: 0, minWidth: 36, height: 30 }}
            />
          )}
        </div>

        <div
          className={`u-flex u-flex-column u-flex-items-center u-flex-justify-center ${
            styles['conversationHistory']
          } ${historyOpen ? styles['conversationHistory--open'] : ''} ${
            isMobile ? styles['conversationHistory--mobile'] : ''
          }`}
        >
          <ConversationList onNewConversation={() => {}} id={conversationId} />
        </div>
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
      </div>
    </div>
  )
}

export default ConversationLayout
