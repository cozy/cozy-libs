import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

import { useClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import ShareSubmit from './Sharesubmit'
import ShareTypeSelect from './Sharetypeselect'

import { Group } from '../models'
import { contactsResponseType, groupsResponseType } from '../propTypes'
import ShareRecipientsInput from './ShareRecipientsInput'
import styles from '../share.styl'
import { validateEmail } from '../helpers/email'
import { getSuccessMessage } from '../helpers/successMessage'

class ShareByEmail extends Component {
  initialState = {
    recipients: [],
    sharingType: 'two-way',
    loading: false
  }

  state = { ...this.initialState }

  reset = () => {
    this.setState({ ...this.initialState })
  }

  onChange = value => {
    this.setState(state => ({ ...state, sharingType: value }))
  }

  onSubmit = () => {
    this.sendSharingLink()
  }

  sanitizeRecipient = recipient => {
    const matches = recipient.email.match(/\s(.+@.+)\s/g)
    recipient.email = matches.length
      ? matches[0]
          .trim()
          .replace(/\s.+/g, '')
          .replace(/^[\W]|[\W]$/g, '')
      : recipient.email
    return recipient
  }

  onRecipientPick = recipient => {
    let contactsToAdd
    if (recipient._type === Group.doctype) {
      const groupId = recipient.id
      contactsToAdd = this.props.contacts.data.filter(contact => {
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
      .filter(contact => !this.state.recipients.find(r => r === contact))

    this.setState(state => ({
      ...state,
      recipients: [...state.recipients, ...filtered]
    }))
  }

  onRecipientRemove = recipient => {
    const idx = this.state.recipients.findIndex(r => r === recipient)
    this.setState(state => ({
      ...state,
      recipients: [
        ...state.recipients.slice(0, idx),
        ...state.recipients.slice(idx + 1)
      ]
    }))
  }

  share = async () => {
    const {
      document,
      sharingDesc,
      onShare,
      createContact,
      documentType
    } = this.props
    const { recipients, sharingType } = this.state
    if (recipients.length === 0) {
      return
    }
    const client = useClient()

    // we can't use currentRecipients prop in getSuccessMessage because it may use
    // the updated prop to count the new recipients
    const recipientsBefore = this.props.currentRecipients

    const verifiedContacts = []
    this.setState(state => ({ ...state, loading: true }))

    await Promise.all(
      recipients.map(async recipient => {
        if (recipient.id) {
          verifiedContacts.push(recipient)
        } else if (validateEmail(recipient.email)) {
          const contact = await client.collection('io.cozy.contacts').find(
            {
              email: {
                $elemMatch: {
                  address: recipient.email
                }
              },
              id: {
                $gt: null
              }
            },
            {
              indexedFields: ['id']
            }
          )
          if (contact.data.length > 0) {
            //We take the shortcut that if we have sevaral contacts
            //with the same address, we take the first one for now
            verifiedContacts.push(contact.data[0])
          } else {
            verifiedContacts.push(recipient)
          }
        }
      })
    )
    try {
      const allCreatedRecipients = await Promise.all(
        verifiedContacts.map(recipient =>
          recipient.id
            ? recipient
            : createContact({
                email: [{ address: recipient.email, primary: true }]
              }).then(resp => resp.data)
        )
      )

      await onShare(document, allCreatedRecipients, sharingType, sharingDesc)

      Alerter.success(
        ...getSuccessMessage(
          recipientsBefore,
          allCreatedRecipients,
          documentType
        )
      )
      this.reset()
    } catch (err) {
      Alerter.error('Error.generic')
      this.reset()
      throw err
    }
  }

  getSharingTypes = () => {
    const { t } = this.props
    return [
      {
        value: 'two-way',
        label: t('Share.type.two-way'),
        desc: t('Share.type.desc.two-way'),
        disabled: false
      },
      {
        value: 'one-way',
        label: t('Share.type.one-way'),
        desc: t('Share.type.desc.one-way'),
        disabled: false
      }
    ]
  }
  render() {
    const { t } = this.context
    const { contacts, documentType, groups } = this.props
    const { recipients } = this.state

    return (
      <div className={styles['coz-form-group']}>
        <div className={styles['coz-form']}>
          <ShareRecipientsInput
            label={t(`${documentType}.share.shareByEmail.email`)}
            placeholder={
              recipients.length === 0
                ? t(`${documentType}.share.shareByEmail.emailPlaceholder`)
                : ''
            }
            onFocus={this.onInputFocus}
            onPick={recipient => this.onRecipientPick(recipient)}
            onRemove={recipient => this.onRecipientRemove(recipient)}
            contacts={contacts}
            groups={groups}
            recipients={recipients}
          />
        </div>
        <div className={styles['share-type-control']}>
          <ShareTypeSelect
            options={this.getSharingTypes()}
            onChange={this.onChange}
          />
          <ShareSubmit
            label={t(`${documentType}.share.shareByEmail.send`)}
            onSubmit={this.share}
            loading={this.state.loading}
            disabled={recipients.length === 0}
          />
        </div>
      </div>
    )
  }
}

ShareByEmail.propTypes = {
  currentRecipients: PropTypes.arrayOf(PropTypes.object),
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  sharingDesc: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired
}

export default translate()(ShareByEmail)
