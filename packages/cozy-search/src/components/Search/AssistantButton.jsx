import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'

import { TwakeAssistantIcon } from '../AssistantIcon/TwakeAssistantIcon'
import { useAssistant } from '../AssistantProvider'
import { makeConversationId } from '../helpers'

export const AssistantButton = ({ size }) => {
  const { onAssistantExecute } = useAssistant()
  const navigate = useNavigate()

  const onClick = () => {
    const conversationId = makeConversationId()
    onAssistantExecute({ value: '', conversationId })
    navigate(`assistant/${conversationId}`)
  }

  return (
    <InputAdornment position="end" className="u-mr-half">
      <IconButton onClick={onClick} size="small" color="primary">
        <Icon icon={TwakeAssistantIcon} size={size === 'medium' ? 24 : 16} />
      </IconButton>
    </InputAdornment>
  )
}
