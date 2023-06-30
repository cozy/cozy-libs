import React, { useState, useEffect } from 'react'

import Avatar from 'cozy-ui/transpiled/react/Avatar'
import ContactsListModal from 'cozy-ui/transpiled/react/ContactsListModal'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'

import Contact from './Contact'
import { useFormData } from '../Hooks/useFormData'
import { useSessionstorage } from '../Hooks/useSessionstorage'

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

const ContactList = ({
  multiple,
  currentUser,
  contactIdsSelected,
  setContactIdsSelected,
  contactModalOpened,
  setContactModalOpened
}) => {
  const { t } = useI18n()
  const { setFormData } = useFormData()
  const [contactsLocalSession, setContactLocalSession] = useSessionstorage(
    'contactList',
    []
  )
  const [contactsList, setContactsList] = useState([
    currentUser,
    ...contactsLocalSession
  ])

  useEffect(() => {
    setContactIdsSelected(prev => {
      if (prev.length === 0) {
        return [currentUser._id]
      } else {
        return prev
      }
    })
  }, [setContactIdsSelected, currentUser._id])

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      contacts: contactsList.filter(contact =>
        contactIdsSelected.includes(contact._id)
      )
    }))
  }, [contactIdsSelected, contactsList, setFormData])

  const onClickContactsListModal = contact => {
    const contactAlreadyListed = contactsList.some(cl => cl._id === contact._id)
    if (!contactAlreadyListed) {
      setContactsList(prev => [...prev, contact])
      setContactLocalSession(prev => [...prev, contact])
    }
    setContactIdsSelected(prev =>
      multiple ? [...prev, contact._id] : [contact._id]
    )
    setContactModalOpened(false)
  }

  return (
    <>
      <Paper elevation={2} className="u-mt-1 u-mh-half">
        <List className="u-pv-0">
          <div className="u-mah-5 u-ov-auto">
            {contactsList.map(contact => (
              <Contact
                key={contact._id}
                contact={contact}
                multiple={multiple}
                contactIdsSelected={contactIdsSelected}
                setContactIdsSelected={setContactIdsSelected}
              />
            ))}
          </div>

          <Divider variant="inset" component="li" />

          <ListItem button onClick={() => setContactModalOpened(true)}>
            <ListItemIcon>
              <Avatar size="small" style={styleAvatar} />
            </ListItemIcon>
            <ListItemText primary={t('ContactStep.other')} />
            <Icon icon="right" size={16} color="var(--secondaryTextColor)" />
          </ListItem>
        </List>
      </Paper>
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

export default ContactList
