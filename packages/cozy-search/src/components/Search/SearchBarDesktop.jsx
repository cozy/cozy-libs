import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useSearch } from './SearchProvider'
import styles from './styles.styl'
import { AssistantIcon } from '../AssistantIcon/AssistantIcon'
import { useAssistant } from '../AssistantProvider'
import ResultMenu from '../ResultMenu/ResultMenu'
import { isAssistantEnabled, makeConversationId } from '../helpers'

const SearchBarDesktop = ({
  value,
  onClear,
  onChange,
  elevation,
  size,
  hasHalfBorderRadius
}) => {
  const { t } = useI18n()
  const { searchValue, results, selectedIndex, setSelectedIndex } = useSearch()
  const { onAssistantExecute } = useAssistant()
  const navigate = useNavigate()
  const searchRef = useRef()
  const listRef = useRef()

  const handleClick = () => {
    if (!isAssistantEnabled()) return

    const conversationId = makeConversationId()
    onAssistantExecute({ value, conversationId })
    navigate(`assistant/${conversationId}`)
    // setTimeout usefull to prevent the field from emptying before the route is changed
    // works because the modal appears on top of the view that carries the input and not instead of it.
    setTimeout(() => {
      onClear()
    }, 100)
  }

  const handleKeyDown = ev => {
    const listElementCount = listRef.current?.childElementCount

    if (ev.key === 'ArrowDown') {
      ev.preventDefault()

      if (selectedIndex === listElementCount - 1) {
        setSelectedIndex(0)
      } else {
        setSelectedIndex(v => v + 1)
      }
    }

    if (ev.key === 'ArrowUp') {
      ev.preventDefault()

      if (selectedIndex === 0) {
        setSelectedIndex(listElementCount - 1)
      } else {
        setSelectedIndex(v => v - 1)
      }
    }

    if (ev.key === 'Escape') {
      ev.preventDefault()
      onClear()
    }

    if (ev.key === 'Enter') {
      ev.preventDefault()
      if (selectedIndex) {
        const onClickFn = results?.[selectedIndex - 1]?.onClick || handleClick
        onClickFn()
      } else if (value !== '') {
        handleClick()
      }
    }
  }

  return (
    <ClickAwayListener onClickAway={onClear}>
      <span>
        <SearchBar
          elevation={elevation}
          className={
            searchValue && hasHalfBorderRadius
              ? styles['searchBarDesktop--result']
              : ''
          }
          ref={searchRef}
          size={size}
          icon={
            size === 'large' ? (
              <Icon className="u-mh-1" icon={AssistantIcon} size={32} />
            ) : (
              <Icon
                className="u-ml-1 u-mr-half"
                icon={AssistantIcon}
                size={24}
              />
            )
          }
          placeholder={
            isAssistantEnabled() ? t('assistant.search.placeholder') : undefined // fallback on SearchBar default
          }
          value={value}
          componentsProps={{
            inputBase: { onKeyDown: handleKeyDown }
          }}
          disabledClear
          disabledFocus={value !== ''}
          onChange={onChange}
        />
        {searchValue && (
          <ResultMenu
            listRef={listRef}
            anchorRef={searchRef}
            onClick={handleClick}
          />
        )}
      </span>
    </ClickAwayListener>
  )
}

SearchBarDesktop.defaultProps = {
  size: 'large',
  elevation: false
}

export default SearchBarDesktop
