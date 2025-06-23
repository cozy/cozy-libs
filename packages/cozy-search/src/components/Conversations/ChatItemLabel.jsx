import React from 'react'

import Markdown from 'cozy-ui/transpiled/react/Markdown'

/**
 * Sanitize chat content by removing special sources tags like
 * [REF]...[/REF] or [doc_X] that are not currently handled.
 *
 * @param {string} content - content to sanitize
 * @returns {string} sanitized content
 */
const sanitizeContent = content => {
  return content
    .replace(/\s?\[REF\][\s\S]*?\[\/REF\]/g, '')
    .replace(/\s?\[doc_\d+\]/g, '')
}

const ChatItemLabel = ({ label }) => {
  const content = sanitizeContent(label)
  if (typeof label === 'string') {
    return <Markdown content={content} />
  }

  return label
}

// need memo to avoid rendering all label of all items
export default React.memo(ChatItemLabel)
