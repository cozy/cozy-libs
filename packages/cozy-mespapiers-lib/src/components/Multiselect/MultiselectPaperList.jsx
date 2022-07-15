import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'

import Home from '../Home/Home'
import PapersListWrapper from '../Papers/PapersListWrapper'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const MultiselectPaperList = ({ setIsFilePickerActive }) => {
  const history = useHistory()
  const [selectedThemeLabel, setSelectedThemeLabel] = useState(null)
  const { t } = useI18n()
  const {
    removeAllCurrentMultiSelectionFiles,
    confirmCurrentMultiSelectionFiles,
    currentMultiSelectionFiles
  } = useMultiSelection()

  const title =
    currentMultiSelectionFiles.length > 0
      ? t('Multiselect.title.nbSelected', {
          smart_count: currentMultiSelectionFiles.length
        })
      : t('Multiselect.title.default')

  const closeMultiSelection = () => {
    setIsFilePickerActive(false)
    setSelectedThemeLabel(null)
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
    selectedThemeLabel ? setSelectedThemeLabel(null) : cancelSelection()
  }

  return (
    <FixedDialog
      open
      transitionDuration={0}
      disableGutters
      onClose={() => setIsFilePickerActive(false)}
      onBack={handleBack}
      title={title}
      content={
        !selectedThemeLabel ? (
          <Home setSelectedThemeLabel={setSelectedThemeLabel} />
        ) : (
          <PapersListWrapper
            history={history}
            selectedThemeLabel={selectedThemeLabel}
          />
        )
      }
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
