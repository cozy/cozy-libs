import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import MultiselectContent from './MultiselectContent'
import MultiselectViewActions from './MultiselectViewActions'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import MultiselectPaperList from './MultiselectPaperList'

const MultiselectView = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [isFilePickerActive, setIsFilePickerActive] = useState(false)
  const { setIsMultiSelectionActive } = useMultiSelection()

  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  useEffect(() => {
    setIsMultiSelectionActive(true)
  }, [setIsMultiSelectionActive])

  const handleClose = () => {
    navigate(backgroundPath || '/paper')
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
