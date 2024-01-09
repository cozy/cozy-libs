import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'

import { isQueryLoading, useClient, useQuery, useQueryAll } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import ContactsListModal from 'cozy-ui/transpiled/react/ContactsListModal'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListItemSkeleton'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Contact from './Contact'
import { SETTINGS_DOCTYPE } from '../../doctypes'
import { buildContactsQueryByIds, getAppSettings } from '../../helpers/queries'

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

let contactList = []

const ContactList = ({
  multiple,
  currentUser,
  className,
  contactModalOpened,
  setContactModalOpened,
  withoutDivider,
  selected,
  onSelection
}) => {
  const { t } = useI18n()
  const client = useClient()

  const { data: settingsData, ...settingsQuery } = useQuery(
    getAppSettings.definition,
    getAppSettings.options
  )
  const isLoadingSettings = isQueryLoading(settingsQuery)

  const suggestedContactIds = settingsData[0]?.suggestedContactIds || []
  const contactsQueryByIds = buildContactsQueryByIds(
    suggestedContactIds,
    !isLoadingSettings
  )
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQueryByIds.definition,
    contactsQueryByIds.options
  )
  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || contactQueryResult.hasMore

  if (!isLoadingSettings && !isLoadingContacts && currentUser) {
    contactList = [currentUser, ...contacts]
  }

  const idsSelected = useMemo(() => selected.map(v => v._id), [selected])

  const onClickContactsListModal = async contact => {
    const contactAlreadyListed = contactList.some(cl => cl._id === contact._id)
    if (!contactAlreadyListed) {
      await client.save({
        ...settingsData[0],
        suggestedContactIds: [...suggestedContactIds, contact._id],
        _type: SETTINGS_DOCTYPE
      })
    }
    onSelection(multiple ? [...selected, contact] : [contact])
    setContactModalOpened(false)
  }

  const onClickContactLine = val => {
    const newValue = val?.target?.value || val

    if (multiple) {
      const newContactIdSelected = [...idsSelected]
      const find = newContactIdSelected.indexOf(newValue)

      if (find > -1) newContactIdSelected.splice(find, 1)
      else newContactIdSelected.push(newValue)

      onSelection(
        contactList.filter(contact =>
          newContactIdSelected.includes(contact._id)
        )
      )
    } else {
      onSelection(contactList.filter(contact => contact.id === newValue))
    }
  }

  // Returns a number of Skeletons based on the number of contactIds in the app settings + the current user
  const Skeleton = useCallback(
    () =>
      Array.from(Array(suggestedContactIds.length + 1), (_, idx) => (
        <ListItemSkeleton key={idx} />
      )),
    [suggestedContactIds.length]
  )

  return (
    <>
      <List className={className}>
        {contactList.length === 0 &&
        (isLoadingSettings || isLoadingContacts) ? (
          <Skeleton />
        ) : (
          <div className="u-mah-5 u-ov-auto">
            {contactList.map(contact => (
              <Contact
                key={contact._id}
                contact={contact}
                multiple={multiple}
                selected={idsSelected.includes(contact._id)}
                onSelection={onClickContactLine}
              />
            ))}
          </div>
        )}

        {!withoutDivider && <Divider variant="inset" component="li" />}
        <ListItem button onClick={() => setContactModalOpened(true)}>
          <ListItemIcon>
            <Avatar size="small" style={styleAvatar} />
          </ListItemIcon>
          <ListItemText primary={t('ContactStep.other')} />
          <Icon icon="right" size={16} color="var(--secondaryTextColor)" />
        </ListItem>
      </List>
      {contactModalOpened && (
        <ContactsListModal
          placeholder={t('ContactStep.contactModal.placeholder')}
          dismissAction={() => setContactModalOpened(false)}
          onItemClick={contact => onClickContactsListModal(contact)}
          addContactLabel={t('ContactStep.contactModal.addContactLabel')}
          emptyMessage={t('ContactStep.contactModal.emptyContact')}
        />
      )}
    </>
  )
}

ContactList.defaultProps = {
  withoutDivider: false
}

ContactList.propTypes = {
  /** Determine whether the user can select several contacts */
  multiple: PropTypes.bool.isRequired,
  /** Contact object representing the current user */
  currentUser: PropTypes.object,
  className: PropTypes.string,
  contactModalOpened: PropTypes.bool.isRequired,
  setContactModalOpened: PropTypes.func.isRequired,
  /** To remove the separation between the contact list and the add contact button */
  withoutDivider: PropTypes.bool,
  /** List of contact to select */
  selected: PropTypes.array.isRequired,
  /** Callback with the list of selected contacts as parameter */
  onSelection: PropTypes.func.isRequired
}

export default ContactList
