import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui-plus/dist/providers/CozyTheme'

import AssistantProvider, { useAssistant } from '../AssistantProvider'
import Conversation from '../Conversations/Conversation'
import ConversationBar from '../Conversations/ConversationBar'
import ConversationLayout from '../Conversations/ConversationLayout'

const AssistantDialog = () => {
  const { assistantState } = useAssistant()
  const { isMobile } = useBreakpoints()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { conversationId } = useParams()

  const onClose = () => {
    try {
      const returnPath = searchParams.get('returnPath')
      if (returnPath) {
        navigate(returnPath)
      } else {
        navigate('..')
      }
    } catch {
      navigate('..')
    }
  }

  return (
    <FixedDialog
      open
      fullScreen
      size="full"
      componentsProps={{
        dialogTitle: { className: 'u-dn' },
        dialogActions: { className: 'u-dn' },
        dialogContent: { className: 'u-p-0' },
        divider: { className: 'u-dn' }
      }}
      disableGutters
      title={isMobile ? ' ' : ' '}
      content={<ConversationLayout conversationId={conversationId} assistantState={assistantState} />}
      onClose={onClose}
    />
  )
}

const AssistantDialogWithProviders = () => {
  return (
    <CozyTheme variant="normal">
      <AssistantProvider>
        <AssistantDialog />
      </AssistantProvider>
    </CozyTheme>
  )
}

export default AssistantDialogWithProviders
