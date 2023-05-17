import PropTypes from 'prop-types'
import React from 'react'

import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ScanActionsWrapper from './ScanActionsWrapper'
import IlluGenericNewPage from '../../assets/icons/IlluGenericNewPage.svg'
import { PaperDefinitionsStepPropTypes } from '../../constants/PaperDefinitionsPropTypes'
import CompositeHeader from '../CompositeHeader/CompositeHeader'

const Scan = ({
  currentStep,
  onChangeFile,
  onOpenFilePickerModal,
  onOpenFlagshipScan
}) => {
  const { t } = useI18n()
  const { illustration, text } = currentStep

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
          onOpenFlagshipScan={onOpenFlagshipScan}
          onOpenFilePickerModal={onOpenFilePickerModal}
        />
      </DialogActions>
    </>
  )
}

Scan.propTypes = {
  currentStep: PaperDefinitionsStepPropTypes,
  onChangeFile: PropTypes.func,
  onOpenFilePickerModal: PropTypes.func,
  onOpenFlagshipScan: PropTypes.func
}

export default Scan
