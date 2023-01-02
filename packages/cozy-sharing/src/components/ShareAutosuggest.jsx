import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'

import { Spinner } from 'cozy-ui/transpiled/react/Spinner'
import palette from 'cozy-ui/transpiled/react/palette'

import styles from './autosuggest.styl'
import BoldCross from '../../assets/icons/icon-cross-bold.svg'

import { getDisplayName, Contact } from '../models'
import {
  cozyUrlMatch,
  emailMatch,
  groupNameMatch,
  fullnameMatch
} from '../suggestionMatchers'
import ContactSuggestion from './ContactSuggestion'
import { extractEmails, validateEmail } from '../helpers/email'

const ShareAutocomplete = ({
  loading,
  contactsAndGroups,
  recipients,
  onFocus,
  onPick,
  onRemove,
  placeholder
}) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isPasted, setIsPasted] = useState(false)

  const autosuggestRef = useRef(null)

  const computeSuggestions = value => {
    const inputValue = value.trim().toLowerCase()

    return inputValue.length === 0
      ? []
      : contactsAndGroups.filter(
          contactOrGroup =>
            groupNameMatch(inputValue, contactOrGroup) ||
            fullnameMatch(inputValue, contactOrGroup) ||
            emailMatch(inputValue, contactOrGroup) ||
            cozyUrlMatch(inputValue, contactOrGroup)
        )
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(computeSuggestions(value))
  }

  const onSuggestionsClearRequested = () => {
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

  const onAutosuggestFocus = () => {
    onFocus()
  }

  const onAutosuggestBlur = (event, { highlightedSuggestion }) => {
    if (highlightedSuggestion) {
      onAutosuggestPick(highlightedSuggestion)
    } else if (inputValue !== '' && inputValue.match(/\S+@\S+/)) {
      onAutosuggestPick({ email: inputValue })
    }
  }

  const onAutosuggestPick = value => {
    onPick(value)
    setInputValue('')
    autosuggestRef?.current?.input?.focus()
  }

  const onAutosuggestRemove = value => {
    onRemove(value)
    autosuggestRef?.current?.input?.focus()
  }

  const renderInput = inputProps => {
    return (
      <div className={styles['recipientsContainer']}>
        {recipients.map((recipient, idx) => {
          const value = getDisplayName(recipient)
          return (
            <div
              className={styles['recipientChip']}
              key={`key_recipient_${idx}`}
            >
              <span>{value}</span>
              <button
                className={styles['removeRecipient']}
                onClick={() => onAutosuggestRemove(recipient)}
              >
                <BoldCross />
              </button>
            </div>
          )
        })}
        <input {...inputProps} onKeyPress={onKeyPress} />
        {loading && (
          <Spinner
            color={palette.dodgerBlue}
            className="u-flex u-flex-items-center"
          />
        )}
      </div>
    )
  }

  return (
    <Autosuggest
      ref={autosuggestRef}
      theme={styles}
      suggestions={suggestions.slice(0, 20)}
      getSuggestionValue={contact => contact}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      renderSuggestion={contactOrGroup => (
        <ContactSuggestion
          contacts={contactsAndGroups.filter(
            item => item._type === Contact.doctype
          )}
          contactOrGroup={contactOrGroup}
        />
      )}
      renderInputComponent={props => renderInput(props)}
      highlightFirstSuggestion
      inputProps={{
        onFocus: onAutosuggestFocus,
        onChange: onAutosuggestChange,
        onPaste: onAutosuggestPaste,
        onBlur: onAutosuggestBlur,
        value: inputValue,
        type: 'email',
        placeholder
      }}
    />
  )
}

ShareAutocomplete.propTypes = {
  loading: PropTypes.bool,
  contactsAndGroups: PropTypes.array,
  recipients: PropTypes.array.isRequired,
  onFocus: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

export default ShareAutocomplete
