import AssistantIcon from 'assets/icons/icon-assistant.png'
import React, { useMemo } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ChatItem from './ChatItem'
import Sources from './Sources/Sources'

const ChatAssistantItem = ({ className, id, label, sources, ...props }) => {
  const { t } = useI18n()
  // need memo to avoid rendering it everytime
  const icon = useMemo(() => <Icon icon={AssistantIcon} size={32} />, [])

  return (
    <>
      <ChatItem
        {...props}
        className={className}
        icon={icon}
        name={t('assistant.name')}
        label={label}
      />
      {sources?.length > 0 && <Sources messageId={id} sources={sources} />}
    </>
  )
}

export default ChatAssistantItem
