import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { contactsResponseType, groupsResponseType } from '../propTypes'
import ShareAutosuggest from './ShareAutosuggest'
import styles from '../share.styl'

const ShareRecipientsInput = ({
  contacts,
  groups,
  recipients,
  label,
  placeholder,
  onPick,
  onRemove
}) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (
      loading &&
      !contacts.hasMore &&
      contacts.fetchStatus === 'loaded' &&
      !groups.hasMore &&
      groups.fetchStatus === 'loaded'
    ) {
      setLoading(false)
    }
  }, [contacts, groups, loading])

  const onFocus = () => {
    if (
      contacts.hasMore ||
      contacts.fetchStatus === 'loading' ||
      groups.hasMore ||
      groups.fetchStatus === 'loading'
    ) {
      setLoading(true)
    }
  }

  const getContactsAndGroups = () => {
    // we need contacts to be loaded to be able to add all group members to recipients
    if (contacts.hasMore || contacts.fetchStatus === 'loading') {
      return contacts.data
    } else {
      return [...contacts.data, ...groups.data]
    }
  }

  return (
    <div>
      <label className={styles['coz-form-label']} htmlFor="email">
        {label}
      </label>
      <ShareAutosuggest
        loading={loading}
        contactsAndGroups={getContactsAndGroups()}
        recipients={recipients}
        onFocus={onFocus}
        onPick={onPick}
        onRemove={onRemove}
        placeholder={placeholder}
      />
    </div>
  )
}

ShareRecipientsInput.propTypes = {
  label: PropTypes.string,
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired,
  recipients: PropTypes.array,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

ShareRecipientsInput.defaultProps = {
  label: 'To:',
  recipients: []
}

export default ShareRecipientsInput
