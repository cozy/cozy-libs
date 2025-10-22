import React, { useState } from "react";

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ConversationList = ({ onNewConversation }) => {
  const { t } = useI18n();

  const [selectedConversation, setSelectedConversation] = useState(0);

  const conversations = [
    {
      title: "Project Update",
      lastMessage: "Reviewed Q3 roadmap",
      date: "2025-10-21"
    },
    {
      title: "Team Alignment",
      lastMessage: "Discussed project timeline",
      date: "2025-10-21"
    },
    {
      title: "Client Feedback",
      lastMessage: "Client suggested revisions",
      date: "2025-10-20"
    },
    {
      title: "Budget Review",
      lastMessage: "Confirmed allocation for design",
      date: "2025-02-15"
    },
    {
      title: "Hiring Discussion",
      lastMessage: "Shortlisted candidates",
      date: "2025-02-14"
    },
    {
      title: "Partnership Proposal",
      lastMessage: "Drafted outline for potential collaboration",
      date: "2025-02-14"
    }
  ]

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
          onClick={onNewConversation}
          variant="primary"
          className="u-w-100 u-bdrs-6"
        />
      </div>
      <Typography className="u-ph-half u-mh-1 u-mb-half" variant="subtitle1" color="textSecondary">
        {t('assistant.conversationList.recentConversations')}
      </Typography>
      <List className="u-ph-half" disabledGutters>
        {conversations.map((conv, index) => (
          <ListItem dense button className="u-bdrs-4 u-mb-half" key={index}
            style={{
              backgroundColor: selectedConversation === index ? 'var(--defaultBackgroundColor)' : undefined,
            }}
            onClick={() => setSelectedConversation(index)}
          >
            <ListItemText>
              <Typography variant="body2">
                {conv.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {conv.lastMessage}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(conv.date).toLocaleDateString()}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ConversationList;