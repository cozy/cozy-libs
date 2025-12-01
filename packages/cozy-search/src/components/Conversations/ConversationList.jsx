import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useClient, useQuery, RealTimeQueries } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { makeConversationId } from '../helpers'
import {
  buildRecentConversationsQuery,
  CHAT_CONVERSATIONS_DOCTYPE
} from '../queries'

const ConversationList = ({ id }) => {
  const { t } = useI18n()
  const client = useClient()
  const navigate = useNavigate()
  const location = useLocation()

  const { conversationId } = useParams()

  const recentConvsQuery = buildRecentConversationsQuery(id)

  const goToConversation = conversationId => {
    const parts = location.pathname.split('/')
    const assistantIndex = parts.findIndex(part => part === 'assistant')

    if (assistantIndex !== -1 && parts.length > assistantIndex + 1) {
      parts[assistantIndex + 1] = conversationId
    } else {
      parts.push('assistant', conversationId)
    }
    const newPathname = parts.join('/')

    navigate({
      pathname: newPathname,
      search: location.search,
      hash: location.hash
    })
  }

  const createNewConversation = () => {
    const newConversationId = makeConversationId()
    goToConversation(newConversationId)
  }

  const { data: conversations } = useQuery(
    recentConvsQuery.definition,
    recentConvsQuery.options
  )

  return (
    <div className="u-flex u-flex-column u-w-100 u-h-100 u-flex-align-center u-flex-justify-start">
      <RealTimeQueries doctype={CHAT_CONVERSATIONS_DOCTYPE} client={client} />
      <div
        style={{
          height: 44
        }}
      />
      <div className="u-m-1-half u-mb-0">
        <Button
          startIcon={<Icon icon="plus" size={14} />}
          label={t('assistant.conversationBar.newChat')}
          onClick={createNewConversation}
          variant="primary"
          className="u-w-100 u-bdrs-6"
        />
      </div>
      <Typography
        className="u-ph-half u-mh-1 u-mb-half"
        variant="subtitle1"
        color="textSecondary"
      >
        {t('assistant.conversationList.recentConversations')}
      </Typography>
      <div
        style={{
          height: '100%',
          width: '100%',
          overflow: 'scroll'
        }}
      >
        <List className="u-ph-half" disabledGutters>
          {conversations &&
            conversations.map((conv, index) => (
              <ListItem
                dense
                button
                className="u-bdrs-4 u-mb-half"
                key={index}
                style={{
                  backgroundColor:
                    conversationId === conv.id
                      ? 'var(--defaultBackgroundColor)'
                      : undefined
                }}
                onClick={() => goToConversation(conv.id)}
              >
                <ListItemText>
                  <Typography variant="body2">
                    {conv.messages[conv.messages.length - 1]?.content}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {conv.messages[conv.messages.length - 1]?.content}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(conv.cozyMetadata?.updatedAt).toLocaleString()}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
        </List>
      </div>
    </div>
  )
}

export default ConversationList
