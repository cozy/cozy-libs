import React, { useState } from 'react'

import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import SearchBarDesktop from './SearchBarDesktop'
import SearchBarMobile from './SearchBarMobile'
import { useSearch } from './SearchProvider'

const SearchBar = () => {
  const { isMobile } = useBreakpoints()
  const [inputValue, setInputValue] = useState('')
  const { clearSearch, setSelectedIndex, delayedSetSearchValue } = useSearch()

  const handleClear = () => {
    setInputValue('')
    clearSearch()
  }

  const handleChange = ev => {
    setSelectedIndex(0)
    delayedSetSearchValue(ev.target.value)
    setInputValue(ev.target.value)
  }

  if (isMobile) {
    return (
      <SearchBarMobile
        value={inputValue}
        onClear={handleClear}
        onChange={handleChange}
      />
    )
  }

  return (
    <SearchBarDesktop
      value={inputValue}
      onClear={handleClear}
      onChange={handleChange}
    />
  )
}

export default SearchBar
