import React, { useState } from "react";

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { useClient, useQuery, Q } from "cozy-client";
import { buildRecentConversationsQuery } from "../queries";

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { makeConversationId } from "../helpers";

const ConversationList = ({ onNewConversation }) => {
  const { t } = useI18n();
  const client = useClient();
  const navigate = useNavigate();
  
  const { conversationId } = useParams()
  const [searchParams] = useSearchParams()

  const recentConvsQuery = buildRecentConversationsQuery()

  const goToConversation = (conversationId) => {
    navigate(`/assistant/${conversationId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
  };

  const createNewConversation = () => {
    const newConversationId = makeConversationId();
    goToConversation(newConversationId);
  };

  const { data: conversations, historyFetchStatus } = useQuery(
    recentConvsQuery.definition,
    recentConvsQuery.options
  );

  return (
    <div className="u-flex u-flex-column u-w-100 u-h-100 u-flex-align-center u-flex-justify-start">
      <div
        style={{
          height: 44
        }}
      />
      <div className="u-m-1-half u-mb-0">
        <Button
          startIcon={<Icon icon={"plus"} size={14} />}
          label={t('assistant.conversationBar.newChat')}
          onClick={createNewConversation}
          variant="primary"
          className="u-w-100 u-bdrs-6"
        />
      </div>
      <Typography className="u-ph-half u-mh-1 u-mb-half" variant="subtitle1" color="textSecondary">
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
          {conversations && conversations.map((conv, index) => (
            <ListItem dense button className="u-bdrs-4 u-mb-half" key={index}
              style={{
                backgroundColor: conversationId === conv.id ? 'var(--defaultBackgroundColor)' : undefined,
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
  );
};

export default ConversationList;