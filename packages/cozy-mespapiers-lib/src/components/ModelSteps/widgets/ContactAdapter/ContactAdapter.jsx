import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'
import TextField from 'cozy-ui/transpiled/react/TextField'

import { SingleContactPicker } from './SingleContactPicker'
import { makeDisplayName } from './helpers'
import { fetchCurrentUser } from '../../../../helpers/fetchCurrentUser'
import { useFormData } from '../../../Hooks/useFormData'

const ContactAdapter = ({ attrs: { inputLabel }, setValidInput, idx }) => {
  const { t } = useI18n()
  const client = useClient()
  const { setFormData } = useFormData()

  const [contactModalOpened, setContactModalOpened] = useState(false)
  const [contactPickerOpened, setContactPickerOpened] = useState(false)
  const [contactSelected, setContactSelected] = useState(null)
  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    const init = async () => {
      const myself = await fetchCurrentUser(client)
      setCurrentUser(myself)
      setContactSelected(myself)
      setFormData(prev => ({
        ...prev,
        contacts: [myself]
      }))
    }
    init()
  }, [client, setContactSelected, setFormData])

  const showContactPicker = () => {
    setContactPickerOpened(true)
  }
  const hideContactPicker = () => {
    setContactPickerOpened(false)
  }

  const isValidInputValue = contactSelected !== null

  useEffect(() => {
    setValidInput(prev => ({
      ...prev,
      [idx]: isValidInputValue
    }))
  }, [idx, isValidInputValue, setValidInput])

  const label = inputLabel ? t(inputLabel) : ''

  const handleContactSelection = contact => {
    setContactSelected(contact)
    setFormData(prev => ({
      ...prev,
      contacts: [contact]
    }))
  }

  return (
    <>
      <TextField
        name="contacts"
        value={makeDisplayName(contactSelected, t)}
        type="button"
        onClick={showContactPicker}
        variant="outlined"
        label={label}
        fullWidth
        inputProps={{
          className: 'u-ta-left'
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Icon icon={BottomIcon} />
            </InputAdornment>
          )
        }}
      />
      {contactPickerOpened && currentUser ? (
        <SingleContactPicker
          label={label}
          selected={contactSelected}
          onSelection={handleContactSelection}
          currentUser={currentUser}
          onClose={hideContactPicker}
          contactModalOpened={contactModalOpened}
          setContactModalOpened={setContactModalOpened}
        />
      ) : null}
    </>
  )
}

ContactAdapter.propTypes = {
  attrs: PropTypes.shape({
    inputLabel: PropTypes.string
  }),
  setValidInput: PropTypes.func.isRequired,
  idx: PropTypes.number
}

export { ContactAdapter }
