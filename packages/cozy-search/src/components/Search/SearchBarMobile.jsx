import React from 'react'

import SearchBar from 'cozy-ui/transpiled/react/SearchBar'

import styles from '../Conversations/styles.styl'

const SearchBarMobile = ({ value, onClear, onChange }) => {
  const handleClear = () => {
    onClear()
  }

  return (
    <SearchBar
      className={styles['conversationBar']}
      size="auto"
      icon={null}
      value={value}
      componentsProps={{
        inputBase: {
          inputProps: {
            className: styles['conversationBar-input']
          },
          autoFocus: true
        }
      }}
      onChange={onChange}
      onClear={handleClear}
    />
  )
}

export default SearchBarMobile
