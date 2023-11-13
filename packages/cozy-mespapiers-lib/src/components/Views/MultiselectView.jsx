import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import MultiselectContent from '../Multiselect/MultiselectContent'
import MultiselectPaperList from '../Multiselect/MultiselectPaperList'
import MultiselectViewActions from '../Multiselect/MultiselectViewActions'

const MultiselectView = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [isFilePickerActive, setIsFilePickerActive] = useState(false)
  const { setIsMultiSelectionActive } = useMultiSelection()

  useEffect(() => {
    setIsMultiSelectionActive(true)
  }, [setIsMultiSelectionActive])

  const handleClose = () => {
    navigate('..')
    setIsMultiSelectionActive(false)
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
      actions={<MultiselectViewActions onClose={handleClose} />}
    />
  )
}

export default MultiselectView
