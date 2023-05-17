import PropTypes from 'prop-types'
import React, { useState } from 'react'

import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import FilePicker from 'cozy-ui/transpiled/react/FilePicker'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ScanActionsWrapper from './ScanActionsWrapper'
import IlluGenericNewPage from '../../assets/icons/IlluGenericNewPage.svg'
import { PaperDefinitionsStepPropTypes } from '../../constants/PaperDefinitionsPropTypes'
import CompositeHeader from '../CompositeHeader/CompositeHeader'

const Scan = ({
  currentStep,
  onChangeFile,
  onChangeFilePicker,
  onOpenFlagshipScan
}) => {
  const { t } = useI18n()
  const { illustration, text } = currentStep

  const [isFilePickerModalOpen, setIsFilePickerModalOpen] = useState(false)

  return (
    <>
      <CompositeHeader
        icon={illustration}
        iconSize="large"
        fallbackIcon={IlluGenericNewPage}
        title={t(text)}
      />
      <DialogActions
        disableSpacing
        className="columnLayout u-mh-0 u-mb-1 cozyDialogActions"
      >
        <ScanActionsWrapper
          onChangeFile={onChangeFile}
          openFilePickerModal={() => setIsFilePickerModalOpen(true)}
          onOpenFlagshipScan={onOpenFlagshipScan}
        />
      </DialogActions>

      {isFilePickerModalOpen && (
        <FilePicker
          onChange={onChangeFilePicker}
          onClose={() => setIsFilePickerModalOpen(false)}
        />
      )}
    </>
  )
}

Scan.propTypes = {
  currentStep: PaperDefinitionsStepPropTypes,
  onChangeFile: PropTypes.func,
  onChangeFilePicker: PropTypes.func,
  onOpenFlagshipScan: PropTypes.func
}

export default Scan
