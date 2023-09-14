import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import ContactsListModal from 'cozy-ui/transpiled/react/ContactsListModal'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import Contact from './Contact'
import { useSessionstorage } from '../Hooks/useSessionstorage'

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

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

  const [contactsLocalSession, setContactLocalSession] = useSessionstorage(
    'contactList',
    []
  )
  const [contactsList, setContactsList] = useState([
    currentUser,
    ...contactsLocalSession
  ])

  const idsSelected = useMemo(() => selected.map(v => v._id), [selected])

  const onClickContactsListModal = contact => {
    const contactAlreadyListed = contactsList.some(cl => cl._id === contact._id)
    if (!contactAlreadyListed) {
      setContactsList(prev => [...prev, contact])
      setContactLocalSession(prev => [...prev, contact])
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
        contactsList.filter(contact =>
          newContactIdSelected.includes(contact._id)
        )
      )
    } else {
      onSelection(contactsList.filter(contact => contact.id === newValue))
    }
  }

  return (
    <>
      <List className={className}>
        <div className="u-mah-5 u-ov-auto">
          {contactsList.map(contact => (
            <Contact
              key={contact._id}
              contact={contact}
              multiple={multiple}
              selected={idsSelected.includes(contact._id)}
              onSelection={onClickContactLine}
            />
          ))}
        </div>
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
  currentUser: PropTypes.object.isRequired,
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
