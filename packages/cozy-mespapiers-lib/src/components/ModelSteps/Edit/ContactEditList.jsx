import React, { useState } from 'react'

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

import ContactEditItem from './ContactEditItem'

const AvatarStyle = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

const ContactEditList = ({
  setContactsList,
  contactsList,
  setContactIdsSelected,
  contactIdsSelected,
  isMultiple
}) => {
  const { t } = useI18n()

  const [contactModalOpened, setContactModalOpened] = useState(false)

  const onClickContactsListModal = contact => {
    const contactAlreadyListed = contactsList.some(cl => cl._id === contact._id)
    if (!contactAlreadyListed) {
      setContactsList(prev => [...prev, contact])
    }
    setContactIdsSelected(prev =>
      contactIdsSelected.length > 1 ? [...prev, contact._id] : [contact._id]
    )
    setContactModalOpened(false)
  }

  return (
    <>
      <Paper elevation={2} className="u-mt-1 u-mh-half">
        <List className="u-pv-0">
          <div className="u-mah-5 u-ov-auto">
            {contactsList.map(contact => (
              <ContactEditItem
                key={contact._id}
                contact={contact}
                isMultiple={isMultiple}
                setContactIdsSelected={setContactIdsSelected}
                contactIdsSelected={contactIdsSelected}
              />
            ))}
          </div>

          <Divider variant="inset" component="li" />

          <ListItem button onClick={() => setContactModalOpened(true)}>
            <ListItemIcon>
              <Avatar size="small" style={AvatarStyle} />
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

export default ContactEditList
