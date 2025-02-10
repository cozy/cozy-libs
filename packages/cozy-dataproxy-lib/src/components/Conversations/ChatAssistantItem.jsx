import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ChatItem from './ChatItem'
import Sources from './Sources/Sources'
import { AssistantIcon } from '../AssistantIcon/AssistantIcon'

const ChatAssistantItem = ({ label, className, id, sources, ...props }) => {
  const { t } = useI18n()
  return (
    <>
      <ChatItem
        {...props}
        label={label}
        className={className}
        icon={<Icon icon={AssistantIcon} size={32} />}
        name={t('assistant.name')}
      />
      {sources?.length > 0 && <Sources messageId={id} sources={sources} />}
    </>
  )
}

export default ChatAssistantItem
