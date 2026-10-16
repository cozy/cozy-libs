import PropTypes from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
import Autosuggest from 'react-autosuggest'

import Chip from 'cozy-ui/transpiled/react/Chips'
import { Spinner } from 'cozy-ui/transpiled/react/Spinner'

import { GroupAvatar } from './Avatar/GroupAvatar'
import { MemberAvatar } from './Avatar/MemberAvatar'
import ContactSuggestion from './ContactSuggestion'
import { isContactToBeCreated } from '../helpers/contacts'
import { extractEmails, validateEmail } from '../helpers/email'
import logger from '../logger'
import { getDisplayName, DOCTYPE_CONTACTS, DOCTYPE_GROUPS } from '../models'
import styles from '../styles/autosuggest.styl'
import { contactOrGroupMatch } from '../suggestionMatchers'

const FETCH_CONTACTS_DEBOUNCE = 300
const FETCH_CONTACTS_MIN_LENGTH = 3

const ShareAutosuggest = ({
  loading,
  disabled,
  contactsAndGroups,
  recipients,
  onPick,
  onRemove,
  enableCreateContact,
  placeholder,
  autoFocus,
  endAdornment,
  fetchContacts
}) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isPasted, setIsPasted] = useState(false)
  const [isLoadingDisplayed, setLoadingDisplayed] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const autosuggestRef = useRef(null)
  const containerRef = useRef(null)
  const fetchTimeoutRef = useRef(null)
  const fetchedValueRef = useRef(null)

  useEffect(() => () => clearTimeout(fetchTimeoutRef.current), [])

  const computeSuggestions = value => {
    const inputValue = value.trim().toLowerCase()

    return inputValue.length === 0
      ? []
      : contactsAndGroups.filter(contactOrGroup =>
          contactOrGroupMatch(inputValue, contactOrGroup)
        )
  }

  const showSuggestions = (computedSuggestions, value) => {
    if (computedSuggestions.length > 0) {
      setSuggestions(computedSuggestions)
    } else if (enableCreateContact && validateEmail(value)) {
      setSuggestions([
        {
          email: value,
          _type: DOCTYPE_CONTACTS
        }
      ])
    } else {
      setSuggestions([])
    }
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    const computedSuggestions = computeSuggestions(value)
    clearTimeout(fetchTimeoutRef.current)
    fetchedValueRef.current = value

    if (!fetchContacts || value.trim().length < FETCH_CONTACTS_MIN_LENGTH) {
      setIsFetching(false)
      showSuggestions(computedSuggestions, value)
      return
    }

    setIsFetching(true)
    fetchTimeoutRef.current = setTimeout(async () => {
      let contacts = []
      try {
        contacts = await fetchContacts(value.trim())
      } catch (err) {
        logger.error('Failed to fetch contact suggestions', err)
      }
      // The user kept typing or left the input while the stack was answering
      if (fetchedValueRef.current !== value) return
      setIsFetching(false)
      showSuggestions([...contacts, ...computedSuggestions], value)
    }, FETCH_CONTACTS_DEBOUNCE)
  }

  const onSuggestionsClearRequested = () => {
    clearTimeout(fetchTimeoutRef.current)
    fetchedValueRef.current = null
    setIsFetching(false)
    setSuggestions([])
  }

  const onAutosuggestPaste = () => {
    setIsPasted(true)
  }

  const onAutosuggestChange = (event, { newValue, method }) => {
    if (isPasted) {
      const emails = extractEmails(newValue)
      if (emails) {
        emails.map(email => {
          onAutosuggestPick({ email })
        })
      }
      setIsPasted(false)
    } else {
      if (typeof newValue !== 'object') {
        setInputValue(newValue)
      } else if (method === 'click' || method === 'enter') {
        // A suggestion has been picked
        onAutosuggestPick(newValue)
      }
    }
  }

  const onKeyPress = event => {
    // The user wants to add an unknown email
    if (
      ((event.key === 'Enter' || event.keyCode === 13) &&
        validateEmail(inputValue)) ||
      ((event.key === 'Space' || event.keyCode === 32) &&
        validateEmail(inputValue))
    ) {
      onAutosuggestPick({ email: inputValue })
    }
  }

  const onKeyUp = ({ key, keyCode }) => {
    if (
      recipients.length > 0 &&
      inputValue === '' &&
      (key === 'Backspace' ||
        keyCode === 8 ||
        key === 'Delete' ||
        keyCode === 46)
    ) {
      document.getElementById(`recipient_${recipients.length - 1}`).focus()
    }
  }

  const onAutosuggestFocus = () => {
    // We only show the loading state when the user has focus on the input
    setLoadingDisplayed(true)
  }

  const onAutosuggestBlur = () => {
    if (inputValue !== '' && inputValue.match(/\S+@\S+/)) {
      onAutosuggestPick({ email: inputValue })
    }
  }

  const onAutosuggestPick = value => {
    if (isContactToBeCreated(value) && !enableCreateContact) return

    onPick(value)
    setInputValue('')
    autosuggestRef?.current?.input?.focus()
  }

  const onAutosuggestRemove = value => {
    onRemove(value)
    autosuggestRef?.current?.input?.focus()
  }

  const onSuggestionHighlighted = () => {
    requestAnimationFrame(() => {
      if (!containerRef.current) return
      const highlighted = containerRef.current.querySelector(
        '[aria-selected="true"]'
      )
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' })
      }
    })
  }

  const renderInput = inputProps => (
    <div className={styles['recipientsContainer']}>
      {recipients.map((recipient, idx) => {
        const isContactGroup = recipient._type === DOCTYPE_GROUPS
        const name = getDisplayName(recipient)
        return (
          <Chip
            id={`recipient_${idx}`}
            key={`key_recipient_${idx}`}
            avatar={
              isContactGroup ? (
                <GroupAvatar size="xs" color={recipient.color} />
              ) : (
                <MemberAvatar size="xs" recipient={recipient} />
              )
            }
            label={name}
            onDelete={() => {
              onAutosuggestRemove(recipient)
            }}
            className={styles['recipientChip']}
          />
        )
      })}
      <input {...inputProps} onKeyPress={onKeyPress} onKeyUp={onKeyUp} />
      {(loading || isFetching) && isLoadingDisplayed ? (
        <Spinner color="var(--primaryColor)" />
      ) : null}
      {endAdornment ? (
        <div className={styles['endAdornment']}>{endAdornment}</div>
      ) : null}
    </div>
  )

  const renderSuggestion = contactOrGroup => (
    <ContactSuggestion contactOrGroup={contactOrGroup} />
  )

  return (
    <div ref={containerRef}>
      <Autosuggest
        ref={autosuggestRef}
        theme={styles}
        suggestions={suggestions.slice(0, 20)}
        getSuggestionValue={contact => contact}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionHighlighted={onSuggestionHighlighted}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInput}
        highlightFirstSuggestion
        inputProps={{
          autoFocus,
          onFocus: onAutosuggestFocus,
          onChange: onAutosuggestChange,
          onPaste: onAutosuggestPaste,
          onBlur: onAutosuggestBlur,
          value: inputValue,
          type: 'email',
          placeholder,
          className: styles['suggestionInput'],
          disabled
        }}
      />
    </div>
  )
}

ShareAutosuggest.defaultProps = {
  autoFocus: true
}

ShareAutosuggest.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  contactsAndGroups: PropTypes.array,
  recipients: PropTypes.array.isRequired,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  enableCreateContact: PropTypes.bool,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  endAdornment: PropTypes.node,
  fetchContacts: PropTypes.func
}

export default ShareAutosuggest
