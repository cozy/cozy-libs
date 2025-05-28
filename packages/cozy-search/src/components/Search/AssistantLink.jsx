import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import AssistantProvider, { useAssistant } from '../AssistantProvider'
import { isAssistantEnabled, makeConversationId } from '../helpers'

const AssistantLink = ({ children }) => {
  const { onAssistantExecute } = useAssistant()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const openAssistant = () => {
    if (!isAssistantEnabled()) return

    const conversationId = makeConversationId()
    onAssistantExecute({ value: '', conversationId })
    navigate(`assistant/${conversationId}?returnPath=${pathname}`)
  }

  return (
    <AssistantProvider>
      {children({
        openAssistant
      })}
    </AssistantProvider>
  )
}

const AssistantLinkWrapper = ({ children }) => {
  return (
    <AssistantProvider>
      <AssistantLink>{children}</AssistantLink>
    </AssistantProvider>
  )
}

export default AssistantLinkWrapper
