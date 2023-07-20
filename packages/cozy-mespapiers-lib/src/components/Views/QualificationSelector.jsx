import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import QualificationGrid from 'cozy-ui/transpiled/react/QualificationGrid'

import { getThemesList } from '../../helpers/themes'

export const QualificationSelector = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const themesList = getThemesList()
  const { qualificationLabel } = useParams()
  const [selectedQualificationLabel, setSelectedQualificationLabel] = useState()

  const handleSubmit = label => {
    const theme = themesList.find(el => el.label === label)
    const qualification = theme.items.find(el => el.label.includes('note_'))

    return navigate(
      `/paper/files/${qualificationLabel}/create/${qualification.label}`
    )
  }

  const handleClose = () => navigate('..')

  return (
    <Dialog
      open
      title={t('ReminderModal.title')}
      content={
        <QualificationGrid
          noUndefined
          noOthers
          onClick={setSelectedQualificationLabel}
        />
      }
      actions={
        <Button
          label={t('common.next')}
          disabled={!selectedQualificationLabel}
          onClick={() => handleSubmit(selectedQualificationLabel)}
        />
      }
      onClose={handleClose}
    />
  )
}
