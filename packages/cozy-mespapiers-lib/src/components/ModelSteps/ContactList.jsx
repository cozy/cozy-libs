import React, { useState, useEffect } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Paper from 'cozy-ui/transpiled/react/Paper'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ContactsListModal from 'cozy-ui/transpiled/react/ContactsListModal'

import { useFormData } from '../Hooks/useFormData'
import { useSessionstorage } from '../Hooks/useSessionstorage'
import Contact from './Contact'

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

const ContactList = ({
  multiple,
  currentUser,
  contactIdsSelected,
  setContactIdsSelected
}) => {
  const { t } = useI18n()
  const { setFormData } = useFormData()
  const [contactModalOpened, setContactModalOpened] = useState(false)
  const [contactsLocalSession, setContactLocalSession] = useSessionstorage(
    'contactList',
    []
  )
  const [contactsList, setContactsList] = useState([
    currentUser,
    ...contactsLocalSession
  ])

  useEffect(() => {
    contactIdsSelected.length === 0 &&
      !multiple &&
      setContactIdsSelected([currentUser._id])
  }, [
    contactIdsSelected.length,
    multiple,
    setContactIdsSelected,
    currentUser._id
  ])

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
      <Paper elevation={2} className={'u-mt-1 u-mh-half'}>
        <List>
          <div className={'u-mah-5 u-ov-auto'}>
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
              <Avatar size={'small'} style={styleAvatar} />
            </ListItemIcon>
            <ListItemText primary={t('ContactStep.other')} />
            <Icon icon="right" size={16} color={'var(--secondaryTextColor)'} />
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
