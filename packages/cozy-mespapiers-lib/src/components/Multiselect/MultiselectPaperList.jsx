import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'

import Home from '../Home/Home'
import PapersListWrapper from '../Papers/PapersListWrapper'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const MultiselectPaperList = ({ setIsActive }) => {
  const history = useHistory()
  const [selectedThemeLabel, setSelectedThemeLabel] = useState(null)
  const { t } = useI18n()
  const { multiSelectionFiles, removeAllMultiSelectionFiles } =
    useMultiSelection()

  const title =
    multiSelectionFiles.length > 0
      ? t('Multiselect.title.nbSelected', {
          smart_count: multiSelectionFiles.length
        })
      : t('Multiselect.title.default')

  const cancelSelection = () => {
    removeAllMultiSelectionFiles()
    setIsActive(false)
    setSelectedThemeLabel(null)
  }

  const goToCurrentSelectionList = () => {
    setIsActive(false)
    setSelectedThemeLabel(null)
  }

  const handleBack = () => {
    selectedThemeLabel ? setSelectedThemeLabel(null) : setIsActive(false)
  }

  return (
    <FixedDialog
      open
      transitionDuration={0}
      disableGutters
      onClose={() => setIsActive(false)}
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
            label={t('common.add')}
            onClick={goToCurrentSelectionList}
            disabled={multiSelectionFiles.length === 0}
          />
          <Button
            label={t('common.cancel')}
            variant="secondary"
            onClick={cancelSelection}
          />
        </>
      }
    />
  )
}

MultiselectPaperList.propTypes = {
  setIsActive: PropTypes.func
}

export default MultiselectPaperList
