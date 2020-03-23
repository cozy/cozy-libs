import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'

import { Spinner } from 'cozy-ui/transpiled/react'
import palette from 'cozy-ui/transpiled/react/palette'

import styles from './autosuggest.styl'
import BoldCross from '../../assets/icons/icon-cross-bold.svg'

import { Contact } from '../models'
import { cozyUrlMatch, emailMatch, groupNameMatch } from '../suggestionMatchers'
import ContactSuggestion from './ContactSuggestion'
import { extractEmails, validateEmail } from '../helpers/email'

export default class ShareAutocomplete extends Component {
  state = {
    inputValue: '',
    suggestions: []
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.contactsAndGroups.length !== prevProps.contactsAndGroups.length
    ) {
      this.onSuggestionsFetchRequested({
        value: this.state.inputValue
      })
    }
  }

  computeSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    return inputValue.length === 0
      ? []
      : this.props.contactsAndGroups.filter(
          contactOrGroup =>
            groupNameMatch(inputValue, contactOrGroup) ||
            emailMatch(inputValue, contactOrGroup) ||
            cozyUrlMatch(inputValue, contactOrGroup)
        )
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState(state => ({
      ...state,
      suggestions: this.computeSuggestions(value)
    }))
  }

  onSuggestionsClearRequested = () => {
    this.setState(state => ({ ...state, suggestions: [] }))
  }
  onPaste = () => {
    this.isPasted = true
  }

  onChange = (event, { newValue, method }) => {
    if (this.isPasted) {
      const emails = extractEmails(newValue)
      if (emails) {
        emails.map(email => {
          this.onPick({ email })
        })
      }
      this.isPasted = false
    } else {
      if (typeof newValue !== 'object') {
        this.setState(state => ({ ...state, inputValue: newValue }))
      } else if (method === 'click' || method === 'enter') {
        // A suggestion has been picked
        this.onPick(newValue)
      }
    }
  }

  onKeyPress = event => {
    // The user wants to add an unknown email
    if (
      ((event.key === 'Enter' || event.keyCode === 13) &&
        validateEmail(this.state.inputValue)) ||
      ((event.key === 'Space' || event.keyCode === 32) &&
        validateEmail(this.state.inputValue))
    ) {
      this.onPick({ email: this.state.inputValue })
    }
  }

  onFocus = () => {
    this.props.onFocus()
  }

  onBlur = (event, { highlightedSuggestion }) => {
    if (highlightedSuggestion) {
      this.props.onPick(highlightedSuggestion)
      this.setState(state => ({ ...state, inputValue: '' }))
    } else if (
      this.state.inputValue !== '' &&
      this.state.inputValue.match(/\S+@\S+/)
    ) {
      this.props.onPick({ email: this.state.inputValue })
      this.setState(state => ({ ...state, inputValue: '' }))
    }
  }

  onPick = value => {
    this.props.onPick(value)
    this.setState(state => ({ ...state, inputValue: '' }))
    setTimeout(() => this.input.focus(), 1) // don't ask...
  }

  onRemove = value => {
    this.props.onRemove(value)
    setTimeout(() => this.input.focus(), 1)
  }

  renderInput(inputProps) {
    const { loading, recipients } = this.props
    return (
      <div className={styles['recipientsContainer']}>
        {recipients.map((recipient, idx) => {
          const value = Contact.getDisplayName(recipient)
          return (
            <div
              className={styles['recipientChip']}
              key={`key_recipient_${idx}`}
            >
              <span>{value}</span>
              <button
                className={styles['removeRecipient']}
                onClick={() => this.onRemove(recipient)}
              >
                <BoldCross />
              </button>
            </div>
          )
        })}
        <input {...inputProps} onKeyPress={this.onKeyPress} />
        {loading && (
          <Spinner
            color={palette.dodgerBlue}
            className="u-flex u-flex-items-center"
          />
        )}
      </div>
    )
  }

  render() {
    const { inputValue, suggestions } = this.state
    const { contactsAndGroups, placeholder } = this.props
    return (
      <Autosuggest
        ref={self => {
          this.input = self ? self.input : null
        }}
        theme={styles}
        suggestions={suggestions.slice(0, 20)}
        getSuggestionValue={contact => contact}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        renderSuggestion={contactOrGroup => (
          <ContactSuggestion
            contacts={contactsAndGroups.filter(
              item => item._type === Contact.doctype
            )}
            contactOrGroup={contactOrGroup}
          />
        )}
        renderInputComponent={props => this.renderInput(props)}
        highlightFirstSuggestion
        inputProps={{
          onFocus: this.onFocus,
          onChange: this.onChange,
          onPaste: this.onPaste,
          onBlur: this.onBlur,
          value: inputValue,
          type: 'email',
          placeholder
        }}
      />
    )
  }
}

ShareAutocomplete.propTypes = {
  contactsAndGroups: PropTypes.array,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  recipients: PropTypes.array.isRequired
}
