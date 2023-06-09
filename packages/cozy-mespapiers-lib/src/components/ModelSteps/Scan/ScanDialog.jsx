import React from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ScanActionsWrapper from './ScanActions/ScanActionsWrapper'
import IlluGenericNewPage from '../../../assets/icons/IlluGenericNewPage.svg'
import CompositeHeader from '../../CompositeHeader/CompositeHeader'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import StepperDialogTitle from '../../StepperDialog/StepperDialogTitle'

const ScanDialog = ({
  currentStep,
  onClose,
  onBack,
  onChangeFile,
  onOpenFlagshipScan,
  onOpenFilePickerModal
}) => {
  const { illustration, text } = currentStep
  const { t } = useI18n()
  const { currentStepIndex } = useStepperDialog()

  return (
    <Dialog
      open
      {...(currentStepIndex > 1 && { transitionDuration: 0, onBack })}
      onClose={onClose}
      componentsProps={{
        dialogTitle: {
          className: 'u-flex u-flex-justify-between u-flex-items-center'
        }
      }}
      title={<StepperDialogTitle />}
      content={
        <CompositeHeader
          icon={illustration}
          iconSize="large"
          fallbackIcon={IlluGenericNewPage}
          title={t(text)}
        />
      }
      actions={
        <ScanActionsWrapper
          onChangeFile={onChangeFile}
          onOpenFlagshipScan={onOpenFlagshipScan}
          onOpenFilePickerModal={onOpenFilePickerModal}
        />
      }
      actionsLayout="column"
    />
  )
}

export default ScanDialog
