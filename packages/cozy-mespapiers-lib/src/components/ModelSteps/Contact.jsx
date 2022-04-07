import React, { useState, useEffect, useCallback, memo } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useClient, models } from 'cozy-client'
import Paper from 'cozy-ui/transpiled/react/Paper'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Right from 'cozy-ui/transpiled/react/Icons/Right'
import Radio from 'cozy-ui/transpiled/react/Radio'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import ContactsListModal from 'cozy-ui/transpiled/react/ContactsListModal'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import { useFormData } from '../Hooks/useFormData'
import { useSessionstorage } from '../Hooks/useSessionstorage'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import ConfirmReplaceFile from './widgets/ConfirmReplaceFile'
import { FILES_DOCTYPE } from '../../doctypes'
import { KEYS } from '../../constants/const'

const { getFullname } = models.contact

const styleAvatar = {
  color: 'var(--primaryColor)',
  backgroundColor: 'var(--primaryColorLightest)'
}

const Contact = () => {
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

  const onChangeRadio = evt => setContactIdSelected(evt.target.value)

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
              <ListItem
                button
                key={contact._id}
                onClick={() => setContactIdSelected(contact._id)}
              >
                <ListItemIcon>
                  <Avatar size={'small'} style={styleAvatar} />
                </ListItemIcon>
                <ListItemText
                  primary={`${getFullname(contact)} ${
                    contact.me ? `(${t('ContactStep.me')})` : ''
                  }`}
                />
                <ListItemSecondaryAction className={'u-mr-half'}>
                  <Radio
                    checked={contactIdSelected === contact._id}
                    onChange={onChangeRadio}
                    value={contact._id}
                    name="radio-contactsList"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </div>

          <Divider variant="inset" component="li" />

          <ListItem button onClick={() => setContactModalOpened(true)}>
            <ListItemIcon>
              <Avatar size={'small'} style={styleAvatar} />
            </ListItemIcon>
            <ListItemText primary={t('ContactStep.other')} />
            <Icon icon={Right} size={16} color={'var(--secondaryTextColor)'} />
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

const ContactWrapper = ({ currentStep, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { illustration, text } = currentStep
  const { formSubmit, formData } = useFormData()
  const [onLoad, setOnLoad] = useState(false)
  const [confirmReplaceFileModal, setConfirmReplaceFileModal] = useState(false)

  const cozyFiles = formData.data.filter(d => d.file.constructor === Blob)

  const closeConfirmReplaceFileModal = () => setConfirmReplaceFileModal(false)
  const openConfirmReplaceFileModal = () => setConfirmReplaceFileModal(true)

  const submit = useCallback(async () => {
    setOnLoad(true)
    await formSubmit()
    onClose()
  }, [onClose, formSubmit])

  const onClickReplace = useCallback(
    isFileReplaced => {
      ;(async () => {
        if (isFileReplaced) {
          for (const { file } of cozyFiles) {
            await client.destroy({ _id: file.id, _type: FILES_DOCTYPE })
          }
        }
        submit()
      })()
    },
    [client, cozyFiles, submit]
  )

  const handleClick = useCallback(() => {
    if (cozyFiles.length > 0) {
      if (!confirmReplaceFileModal) openConfirmReplaceFileModal()
      else onClickReplace(true)
    } else {
      submit()
    }
  }, [cozyFiles.length, confirmReplaceFileModal, onClickReplace, submit])

  const handleKeyDown = useCallback(
    ({ key }) => {
      if (key === KEYS.ENTER) handleClick()
    },
    [handleClick]
  )

  useEventListener(window, 'keydown', handleKeyDown)

  return (
    <>
      <CompositeHeader
        icon={illustration}
        iconSize={'small'}
        title={t(text)}
        text={<Contact />}
      />
      <DialogActions className={'u-w-100 u-mh-0 u-mb-1 cozyDialogActions'}>
        <Button
          fullWidth
          label={t(!onLoad ? 'ContactStep.save' : 'ContactStep.onLoad')}
          onClick={handleClick}
          disabled={onLoad}
          busy={onLoad}
        />
      </DialogActions>

      {confirmReplaceFileModal && (
        <ConfirmReplaceFile
          onClose={closeConfirmReplaceFileModal}
          onReplace={onClickReplace}
          cozyFilesCount={cozyFiles.length}
        />
      )}
    </>
  )
}

export default memo(ContactWrapper)
