import React, { useState, useEffect } from 'react'

import { useClient } from 'cozy-client'
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
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import Contact from './Contact'

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

const ContactList = () => {
  const client = useClient()
  const { t } = useI18n()
  const { setFormData } = useFormData()
  const [contactModalOpened, setContactModalOpened] = useState(false)
  const [contactsList, setContactsList] = useState([])
  const [contactIdSelected, setContactIdSelected] = useState(null)
  const [contactsLocalSession, setContactLocalSession] = useSessionstorage(
    'contactList',
    []
  )

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const myself = await fetchCurrentUser(client)
      if (isMounted) {
        setContactsList([myself, ...contactsLocalSession])
        !contactIdSelected && setContactIdSelected(myself._id)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [client, contactIdSelected, contactsLocalSession])

  useEffect(() => {
    if (contactIdSelected) {
      setFormData(prev => ({
        ...prev,
        contacts: contactsList.filter(
          contact => contact._id === contactIdSelected
        )
      }))
    }
  }, [contactIdSelected, contactsList, setFormData])

  const onClickContactsListModal = contact => {
    const contactAlreadyListed = contactsList.some(cl => cl._id === contact._id)
    if (!contactAlreadyListed) {
      setContactsList(prev => [...prev, contact])
      setContactLocalSession(prev => [...prev, contact])
    }
    setContactIdSelected(contact._id)
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
                contactIdSelected={contactIdSelected}
                setContactIdSelected={setContactIdSelected}
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
