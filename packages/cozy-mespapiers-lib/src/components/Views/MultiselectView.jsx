import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import MultiselectContent from '../Multiselect/MultiselectContent'
import MultiselectPaperList from '../Multiselect/MultiselectPaperList'
import MultiselectViewActions from '../Multiselect/MultiselectViewActions'

const MultiselectView = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [isFilePickerActive, setIsFilePickerActive] = useState(false)

  const handleClose = () => {
    navigate('..')
  }

  return (
    <FixedDialog
      open
      transitionDuration={0}
      onClose={handleClose}
      size="large"
      title={t('Multiselect.title.default')}
      content={
        <>
          <MultiselectContent setIsFilePickerActive={setIsFilePickerActive} />
          {isFilePickerActive && (
            <MultiselectPaperList
              setIsFilePickerActive={setIsFilePickerActive}
            />
          )}
        </>
      }
      actions={<MultiselectViewActions />}
    />
  )
}

export default MultiselectView
