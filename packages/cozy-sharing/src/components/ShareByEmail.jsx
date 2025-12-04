import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import ShareRecipientsInput from './ShareRecipientsInput'
import { ShareRecipientsLimitModal } from './ShareRecipientsLimitModal'
import ShareSubmit from './Sharesubmit'
import ShareTypeSelect from './Sharetypeselect'
import { getOrCreateFromArray } from '../helpers/contacts'
import {
  mergeRecipients,
  spreadGroupAndMergeRecipients,
  hasReachRecipientsLimit
} from '../helpers/recipients'
import { getSuccessMessage, getErrorMessage } from '../helpers/share'
import { isReadOnlySharing } from '../state'
import styles from '../styles/share.styl'

export const ShareByEmail = ({
  document,
  sharingDesc,
  onShare,
  createContact,
  documentType,
  currentRecipients,
  sharing,
  submitLabel,
  showNotifications = true
}) => {
  const client = useClient()
  const { t } = useI18n()
  const { showAlert } = useAlert()

  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState('readWrite')
  const [showRecipientsLimit, setRecipientsLimit] = useState(false)

  const reset = () => {
    setSelectedOption('readWrite')
    setRecipients([])
    setLoading(false)
  }

  const onChange = value => {
    setSelectedOption(value)
  }

  const onRecipientPick = recipient => {
    const mergedRecipients = flag('sharing.show-recipient-groups')
      ? mergeRecipients(recipients, recipient)
      : spreadGroupAndMergeRecipients(recipients, recipient)
    setRecipients(mergedRecipients)
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

      if (showNotifications) {
        showAlert({
          message: t(
            ...getSuccessMessage(recipientsBefore, contacts, documentType)
          ),
          severity: 'success',
          variant: 'filled'
        })
      }
    } catch (err) {
      if (showNotifications) {
        showAlert({
          message: t(
            ...getErrorMessage({
              t,
              err,
              documentType,
              recipients,
              selectedOption
            })
          ),
          severity: 'error',
          variant: 'filled'
        })
      }
    } finally {
      reset()
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
          currentRecipients={currentRecipients}
          recipients={recipients}
        />
      </div>
      {showShareControl && (
        <div className={styles['share-type-control']}>
          <ShareTypeSelect
            value={selectedOption}
            options={getSharingOptions()}
            onChange={onChange}
          />
          <ShareSubmit
            label={submitLabel || t(`${documentType}.share.shareByEmail.send`)}
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
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  sharingDesc: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired,
  // We can display this component without having created the sharing yet
  sharing: PropTypes.object,
  // Customize the label of the button that submit contacts
  submitLabel: PropTypes.string,
  // Display success or error notifications
  showNotifications: PropTypes.bool
}

export default ShareByEmail
