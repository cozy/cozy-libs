import flag from 'cozy-flags'

export const makeConversationId = () =>
  `${Date.now()}-${Math.floor(Math.random() * 90000) + 10000}`

export const isAssistantEnabled = () => flag('cozy.assistant.legacy.enabled')

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
      // remove « [Source 1] », « [Source 4, 6] » or « [Source 4, Source 6] »
      .replace(/\s?\[Source\s+\d+(?:\s*,\s*(?:Source\s+)?\d+)*\]/g, '')
      // remove « [Sources: 1, 3, 6] » citations, with optional empty link parens
      .replace(/\s?\[Sources?:\s*\d+(?:\s*,\s*\d+)*\s*\](?:\([^)]*\))?/g, '')
  )
}

/**
 * Formats a chat message's answer: sanitizes citation markup, and
 * substitutes a translated fallback when an assistant answer is empty.
 * Used wherever an assistant response may come back empty from the RAG backend.
 *
 * @param {{ role: string, content: string }} message
 * @param {(key: string) => string} t - translation function from twake-i18n
 * @returns {string}
 */
export const formatAnswer = (message, t) => {
  const sanitized = sanitizeChatContent(message.content)
  return message.role === 'assistant' && !sanitized.trim()
    ? t('assistant.default_empty_response')
    : sanitized
}

export const formatConversationDate = (dateString, t, lang) => {
  if (!dateString) return ''
  const date = new Date(dateString)

  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isToday || isYesterday) {
    const timeStr = date.toLocaleTimeString(lang, {
      hour: 'numeric',
      minute: '2-digit'
    })
    return `${
      isToday ? t('assistant.time.today') : t('assistant.time.yesterday')
    }, ${timeStr}`
  }

  return date.toLocaleDateString(lang, {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

/**
 * Get name of the conversation
 * Since we don't have rule for conversation's name
 * So temporary we get the last question from user as name of the conversation
 */
export const getNameOfConversation = conversation => {
  return (
    conversation.name ||
    conversation.messages?.[conversation.messages?.length - 2]?.content
  )
}

/**
 * Get description of the conversation
 * Since we don't have rule for description of the conversation
 * So temporary we get the last answer from assistant as description of the conversation
 */
export const getDescriptionOfConversation = (conversation, t) => {
  const lastMessage = conversation?.messages?.[conversation.messages.length - 1]
  if (!lastMessage) return undefined
  return formatAnswer(lastMessage, t)
}
