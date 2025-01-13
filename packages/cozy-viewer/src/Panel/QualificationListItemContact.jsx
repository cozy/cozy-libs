import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import {
  getTranslatedNameForContact,
  formatContactValue
} from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ActionMenuWrapper from './ActionMenuWrapper'
import QualificationListItemText from './QualificationListItemText'
import IntentOpener from '../components/IntentOpener'
import useReferencedContactName from '../hooks/useReferencedContactName'

const QualificationListItemContact = ({ file, isReadOnly }) => {
  const { lang } = useI18n()
  const actionBtnRef = useRef()
  const [optionFile, setOptionFile] = useState({
    name: '',
    value: ''
  })
  const { contacts, isLoadingContacts } = useReferencedContactName(file)

  if (isLoadingContacts) {
    return (
      <ListItem>
        <Spinner color="var(--secondaryTextColor)" />
      </ListItem>
    )
  }

  const formattedValue = formatContactValue(contacts)

  if (!formattedValue) {
    return null
  }

  const formattedTitle = getTranslatedNameForContact({ lang })
  const qualificationLabel = file.metadata.qualification.label

  const hideActionsMenu = () => setOptionFile({ name: '', value: '' })
  const toggleActionsMenu = (name, value) =>
    setOptionFile(prev => {
      if (prev.value) return { name: '', value: '' }
      return { name, value }
    })

  return (
    <>
      <IntentOpener
        action="OPEN"
        doctype="io.cozy.files.paper"
        options={{
          path: `${qualificationLabel}/${file._id}/edit/contact`
        }}
        disabled={!!formattedValue || isReadOnly}
      >
        <ListItem button={!formattedValue && !isReadOnly}>
          <ListItemIcon>
            <Icon icon={PeopleIcon} />
          </ListItemIcon>
          <QualificationListItemText
            primary={formattedTitle}
            secondary={formattedValue}
          />
          <ListItemSecondaryAction>
            <IconButton
              ref={actionBtnRef}
              onClick={() => toggleActionsMenu('contact', formattedValue)}
            >
              <Icon icon={Dots} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </IntentOpener>

      {optionFile.value && (
        <ActionMenuWrapper
          onClose={hideActionsMenu}
          file={file}
          optionFile={optionFile}
          ref={actionBtnRef}
          isReadOnly={isReadOnly}
        />
      )}
    </>
  )
}

QualificationListItemContact.propTypes = {
  file: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool
}

export default QualificationListItemContact
