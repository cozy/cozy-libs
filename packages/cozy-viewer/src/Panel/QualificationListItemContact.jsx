import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import {
  getTranslatedNameForContact,
  formatContactValue
} from 'cozy-client/dist/models/paper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Dots from 'cozy-ui/transpiled/react/Icons/Dots'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ActionMenuWrapper from './ActionMenuWrapper'
import QualificationListItemText from './QualificationListItemText'
import useReferencedContactName from '../hooks/useReferencedContactName'

const QualificationListItemContact = ({ file }) => {
  const { lang } = useI18n()
  const actionBtnRef = useRef()
  const [optionFile, setOptionFile] = useState({
    name: '',
    value: ''
  })

  const hideActionsMenu = () => setOptionFile({ name: '', value: '' })
  const toggleActionsMenu = (name, value) =>
    setOptionFile(prev => {
      if (prev.value) return { name: '', value: '' }
      return { name, value }
    })

  const { contacts, isLoadingContacts } = useReferencedContactName(file)

  if (isLoadingContacts) {
    return (
      <ListItem className="u-pl-2 u-pr-3">
        <Spinner color="var(--secondaryTextColor)" />
      </ListItem>
    )
  }

  const formattedTitle = getTranslatedNameForContact({ lang })
  const formattedValue = formatContactValue(contacts)

  if (!isLoadingContacts && !formattedValue) {
    return null
  }

  return (
    <>
      <ListItem className="u-ph-2">
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

      {optionFile.value && (
        <ActionMenuWrapper
          onClose={hideActionsMenu}
          file={file}
          optionFile={optionFile}
          ref={actionBtnRef}
        />
      )}
    </>
  )
}

QualificationListItemContact.propTypes = {
  file: PropTypes.object.isRequired
}

export default QualificationListItemContact
