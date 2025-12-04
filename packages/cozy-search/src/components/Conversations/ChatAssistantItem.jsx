import React from 'react'
import { useI18n } from 'twake-i18n'

import Icon from 'cozy-ui/transpiled/react/Icon'

import ChatItem from './ChatItem'
import Sources from './Sources/Sources'
import { TwakeAssistantIcon } from '../AssistantIcon/TwakeAssistantIcon'

const ChatAssistantItem = ({ label, className, id, sources, ...props }) => {
  const { t } = useI18n()

  return (
    <>
      <ChatItem
        {...props}
        label={label}
        className={className}
        icon={
          <Icon
            icon={TwakeAssistantIcon}
            size={24}
            className="u-mh-half"
            color="var(--primaryColor)"
          />
        }
        name={t('assistant.name')}
      />
      {sources?.length > 0 && <Sources messageId={id} sources={sources} />}
    </>
  )
}

export default ChatAssistantItem
