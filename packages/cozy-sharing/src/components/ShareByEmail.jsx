import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

import { withClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import ShareSubmit from './Sharesubmit'
import ShareTypeSelect from './Sharetypeselect'

import { Group } from '../models'
import { contactsResponseType, groupsResponseType } from '../propTypes'
import ShareRecipientsInput from './ShareRecipientsInput'
import styles from '../share.styl'
import { getSuccessMessage } from '../helpers/successMessage'
import { getOrCreateFromArray } from '../helpers/contacts'
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
      documentType,
      client
    } = this.props
    const { recipients, sharingType } = this.state
    if (recipients.length === 0) {
      return
    }

    // we can't use currentRecipients prop in getSuccessMessage because it may use
    // the updated prop to count the new recipients
    const recipientsBefore = this.props.currentRecipients

    this.setState(state => ({ ...state, loading: true }))
    try {
      const contacts = await getOrCreateFromArray(
        client,
        recipients,
        createContact
      )
      await onShare(document, contacts, sharingType, sharingDesc)

      Alerter.success(
        ...getSuccessMessage(recipientsBefore, contacts, documentType)
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
    const { contacts, documentType, groups, t } = this.props
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

export default translate()(withClient(ShareByEmail))
