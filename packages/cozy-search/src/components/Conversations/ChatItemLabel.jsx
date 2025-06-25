import React from 'react'

import Markdown from 'cozy-ui/transpiled/react/Markdown'

import { sanitizeChatContent } from '../helpers'

const ChatItemLabel = ({ label }) => {
  if (typeof label === 'string') {
    const content = sanitizeChatContent(label)
    return <Markdown content={content} />
  }

  return label
}

// need memo to avoid rendering all label of all items
export default React.memo(ChatItemLabel)
