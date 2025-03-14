import React, { useRef } from 'react'

import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import SuggestionsPlaceholder from './SuggestionsPlaceholder'
import styles from '../Conversations/styles.styl'
import { isAssistantEnabled } from '../helpers'

const SearchBarMobile = ({ value, onClear, onChange }) => {
  const inputRef = useRef()

  // to adjust input height for multiline when typing in it
  useEventListener(inputRef.current, 'input', () => {
    inputRef.current.style.height = 'auto' // to resize input when emptying it
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
  })

  const handleClear = () => {
    onClear()
    inputRef.current.style.height = 'auto'
  }

  return (
    <SearchBar
      className={styles['conversationBar']}
      size="auto"
      icon={null}
      placeholder={isAssistantEnabled() ? ' ' : undefined} // if assistant enabled, we set a blank space because we want only the SuggestionsPlaceholder below
      value={value}
      componentsProps={{
        inputBase: {
          inputProps: {
            className: styles['conversationBar-input']
          },
          inputRef: inputRef,
          autoFocus: true,
          rows: 1,
          multiline: true,
          startAdornment: isAssistantEnabled() && !value && (
            <SuggestionsPlaceholder />
          )
        }
      }}
      onChange={onChange}
      onClear={handleClear}
    />
  )
}

export default SearchBarMobile
