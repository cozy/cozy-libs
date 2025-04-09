import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import { useCozyTheme } from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ChatItem from './ChatItem'
import Sources from './Sources/Sources'
import { AssistantIcon } from '../AssistantIcon/AssistantIcon'
import { TwakeAssistantIcon } from '../AssistantIcon/TwakeAssistantIcon'

const ChatAssistantItem = ({ label, className, id, sources, ...props }) => {
  const { t } = useI18n()
  const { type } = useCozyTheme()

  return (
    <>
      <ChatItem
        {...props}
        label={label}
        className={className}
        icon={
          <Icon
            icon={isTwakeTheme() ? TwakeAssistantIcon : AssistantIcon}
            size={isTwakeTheme() ? 24 : 32}
            className={isTwakeTheme() ? 'u-mh-half' : undefined}
            color={
              isTwakeTheme()
                ? type === 'light'
                  ? 'var(--primaryColor)'
                  : 'var(--white)'
                : undefined
            }
          />
        }
        name={t('assistant.name', { name: isTwakeTheme() ? 'Twake' : 'Cozy' })}
      />
      {sources?.length > 0 && <Sources messageId={id} sources={sources} />}
    </>
  )
}

export default ChatAssistantItem
