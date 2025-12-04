import React from 'react'

import flag from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'

import styles from '../../Stylus/Conversation.styl'

const ConversationSwitcher = ({ historyOpen, setHistoryOpen }) => {
  return (
    <div
      className={`${styles['conversationSwitcher']} ${
        historyOpen
          ? styles['conversationSwitcher--open']
          : styles['conversationSwitcher--closed']
      }`}
    >
      <Button
        label={<Icon icon="burger" />}
        onClick={() => {
          setHistoryOpen(!historyOpen)
        }}
        variant={historyOpen ? 'ghost' : 'text'}
        className={`u-bdrs-4 ${styles['conversationSwitcher-button']}`}
      />

      {flag('cozy.assistant.demo') && (
        <Button
          label={<Icon icon="magnifier" />}
          variant="text"
          className={`u-bdrs-4 ${styles['conversationSwitcher-button']}`}
        />
      )}
    </div>
  )
}

export default ConversationSwitcher
