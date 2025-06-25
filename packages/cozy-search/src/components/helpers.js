import flag from 'cozy-flags'

export const getInstantMessage = assistantState =>
  Object.keys(assistantState.message)
    .sort((a, b) => a - b)
    .map(key => assistantState.message[key])
    .join('')

export const makeConversationId = () =>
  `${Date.now()}-${Math.floor(Math.random() * 90000) + 10000}`

export const pushMessagesIdInState = (id, res, setState) => {
  if (id !== res._id) return

  const messagesId = res.messages.map(message => message.id)
  setState(v => ({
    ...v,
    messagesId
  }))
}

export const isMessageForThisConversation = (res, messagesId) =>
  messagesId.includes(res._id)

export const isAssistantEnabled = () => flag('cozy.assistant.enabled')

/**
 * Sanitize chat content by removing special sources tags like
 * [REF]...[/REF] or [doc_X] that are not currently handled.
 *
 * @param {string} content - content to sanitize
 * @returns {string} sanitized content
 */
export const sanitizeChatContent = content => {
  if (!content) {
    return ''
  }
  return (
    content
      // Remove REFdoc_1/REF
      .replace(/\s?\[REF\][\s\S]*?\[\/REF\]/g, '')
      // Remove [REF]doc_1[/REF]
      .replace(/\s?REF[\s\S]*?\/REF/g, '')
      // remove « [doc_1] »
      .replace(/\s?\[doc_\d+\]/g, '')
  )
}
