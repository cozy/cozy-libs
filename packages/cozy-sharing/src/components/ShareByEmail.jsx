import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ShareRecipientsInput from './ShareRecipientsInput'
import { ShareRecipientsLimitModal } from './ShareRecipientsLimitModal'
import ShareSubmit from './Sharesubmit'
import ShareTypeSelect from './Sharetypeselect'
import { getOrCreateFromArray } from '../helpers/contacts'
import { hasReachRecipientsLimit } from '../helpers/recipients'
import { getSuccessMessage } from '../helpers/successMessage'
import { Group } from '../models'
import { contactsResponseType, groupsResponseType } from '../propTypes'
import styles from '../share.styl'
import { isReadOnlySharing } from '../state'

export const ShareByEmail = ({
  contacts,
  groups,
  document,
  sharingDesc,
  onShare,
  createContact,
  documentType,
  currentRecipients,
  sharing
}) => {
  const client = useClient()
  const { t } = useI18n()
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState()
  const [showRecipientsLimit, setRecipientsLimit] = useState(false)

  const reset = () => {
    setRecipients([])
    setLoading(false)
  }

  const onChange = value => {
    setSelectedOption(value)
  }

  const onRecipientPick = recipient => {
    let contactsToAdd
    if (recipient._type === Group.doctype) {
      const groupId = recipient.id
      contactsToAdd = contacts.data.filter(contact => {
        const contactGroupIds = get(
          contact,
          'relationships.groups.data',
          []
        ).map(group => group._id)

        return contactGroupIds.includes(groupId)
      })
    } else {
      contactsToAdd = [recipient]
    }

    const filtered = contactsToAdd
      .filter(
        contact =>
          (contact.email && contact.email.length > 0) ||
          (contact.cozy && contact.cozy.length > 0)
      )
      .filter(contact => !recipients.find(r => r === contact))

    setRecipients([...recipients, ...filtered])
  }

  const onRecipientRemove = recipient => {
    const idx = recipients.findIndex(r => r === recipient)
    setRecipients([...recipients.slice(0, idx), ...recipients.slice(idx + 1)])
  }

  const share = async () => {
    if (recipients.length === 0) {
      return
    }

    // we can't use currentRecipients prop in getSuccessMessage because it may use
    // the updated prop to count the new recipients
    const recipientsBefore = currentRecipients

    if (hasReachRecipientsLimit(recipientsBefore, recipients)) {
      setRecipientsLimit(true)
      return
    }

    setLoading(true)
    try {
      const contacts = await getOrCreateFromArray(
        client,
        recipients,
        createContact
      )
      let readWriteRecipients = []
      let readOnlyRecipients = []
      if (selectedOption === 'readOnly') {
        readOnlyRecipients = contacts
      } else {
        readWriteRecipients = contacts
      }
      await onShare({
        document,
        recipients: readWriteRecipients,
        readOnlyRecipients,
        description: sharingDesc,
        openSharing: readWriteRecipients.length > 0
      })

      Alerter.success(
        t(...getSuccessMessage(recipientsBefore, contacts, documentType))
      )
      reset()
    } catch (err) {
      Alerter.error('Error.generic')
      reset()
      throw err
    }
  }

  const getSharingOptions = () => {
    const isSharingReadOnly = sharing
      ? isReadOnlySharing(sharing, document._id)
      : false
    const readWrite = {
      value: 'readWrite',
      label: t('Share.type.two-way'),
      desc: t('Share.type.desc.two-way'),
      disabled: false
    }
    const readOnly = {
      value: 'readOnly',
      label: t('Share.type.one-way'),
      desc: t('Share.type.desc.one-way'),
      disabled: false
    }
    return isSharingReadOnly ? [readOnly] : [readWrite, readOnly]
  }

  const showShareControl = recipients.length > 0

  return (
    <div className={styles['coz-form-group']}>
      <div className={styles['coz-form']}>
        <ShareRecipientsInput
          placeholder={
            recipients.length === 0
              ? t(`${documentType}.share.shareByEmail.emailPlaceholder`)
              : ''
          }
          onPick={recipient => onRecipientPick(recipient)}
          onRemove={recipient => onRecipientRemove(recipient)}
          contacts={contacts}
          groups={groups}
          recipients={recipients}
        />
      </div>
      {showShareControl && (
        <div className={styles['share-type-control']}>
          <ShareTypeSelect options={getSharingOptions()} onChange={onChange} />
          <ShareSubmit
            label={t(`${documentType}.share.shareByEmail.send`)}
            onSubmit={share}
            loading={loading}
            disabled={recipients.length === 0}
          />
        </div>
      )}
      {showRecipientsLimit ? (
        <ShareRecipientsLimitModal
          documentName={document.name}
          onConfirm={() => setRecipientsLimit(false)}
        />
      ) : null}
    </div>
  )
}

ShareByEmail.propTypes = {
  currentRecipients: PropTypes.arrayOf(PropTypes.object),
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  sharingDesc: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired,
  // We can display this component without having created the sharing yet
  sharing: PropTypes.object
}

export default ShareByEmail
