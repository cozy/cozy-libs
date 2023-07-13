import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { useMultiSelection } from '../Hooks/useMultiSelection'
import Home from '../Views/Home'
import PapersList from '../Views/PapersList'

const MultiselectPaperList = ({ setIsFilePickerActive }) => {
  const { t } = useI18n()
  const {
    removeAllCurrentMultiSelectionFiles,
    confirmCurrentMultiSelectionFiles,
    currentMultiSelectionFiles,
    selectedQualificationLabel,
    setSelectedQualificationLabel
  } = useMultiSelection()

  const title =
    currentMultiSelectionFiles.length > 0
      ? t('Multiselect.title.nbSelected', {
          smart_count: currentMultiSelectionFiles.length
        })
      : t('Multiselect.title.default')

  const closeMultiSelection = () => {
    setIsFilePickerActive(false)
    setSelectedQualificationLabel(null)
  }

  const cancelSelection = () => {
    removeAllCurrentMultiSelectionFiles()
    closeMultiSelection()
  }

  const goToCurrentSelectionList = () => {
    confirmCurrentMultiSelectionFiles()
    closeMultiSelection()
  }

  const handleBack = () => {
    selectedQualificationLabel
      ? setSelectedQualificationLabel(null)
      : cancelSelection()
  }

  return (
    <FixedDialog
      open
      transitionDuration={0}
      disableGutters
      onClose={() => setIsFilePickerActive(false)}
      size="medium"
      onBack={handleBack}
      title={title}
      content={!selectedQualificationLabel ? <Home /> : <PapersList />}
      actions={
        <>
          <Button
            label={t('common.cancel')}
            variant="secondary"
            onClick={cancelSelection}
          />
          <Button
            label={t('common.add')}
            onClick={goToCurrentSelectionList}
            disabled={currentMultiSelectionFiles.length === 0}
          />
        </>
      }
    />
  )
}

MultiselectPaperList.propTypes = {
  setIsFilePickerActive: PropTypes.func
}

export default MultiselectPaperList
