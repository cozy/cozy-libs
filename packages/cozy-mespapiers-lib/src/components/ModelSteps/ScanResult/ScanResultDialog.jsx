import cx from 'classnames'
import React, { useRef, useState } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import ScanResultCard from './ScanResultCard'
import ScanResultInfo from './ScanResultInfo'
import ScanResultTitle from './ScanResultTitle'
import { KEYS } from '../../../constants/const'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import StepperDialogTitle from '../../StepperDialog/StepperDialogTitle'
import { makeFileFromBase64 } from '../helpers'

const ScanResultDialog = ({
  currentStep,
  onClose,
  onBack,
  onChangeFile,
  currentFile,
  setCurrentFile
}) => {
  const { illustration, multipage, page = 'default', tooltip } = currentStep
  const { t } = useI18n()
  const { currentStepIndex } = useStepperDialog()

  const imageRef = useRef(null)
  const [rotationImage, setRotationImage] = useState(0)
  const { nextStep } = useStepperDialog()

  const onValid = addPage => {
    if (rotationImage % 360 !== 0) {
      const newFile = makeFileFromBase64({
        source: imageRef.current.src,
        name: currentFile.name,
        type: currentFile.type
      })
      onChangeFile(newFile, { replace: true })
    }

    if (addPage) {
      setCurrentFile(null)
    } else {
      nextStep()
    }
  }

  const handleNextStep = () => onValid(false)
  const handleRepeatStep = () => onValid(true)

  const handleKeyDown = ({ key }) => {
    if (key === KEYS.ENTER) handleNextStep()
  }

  useEventListener(window, 'keydown', handleKeyDown)

  return (
    <Dialog
      open
      {...(currentStepIndex > 0 && { onBack })}
      transitionDuration={0}
      onClose={onClose}
      componentsProps={{
        dialogTitle: {
          className: 'u-flex u-flex-justify-between u-flex-items-center'
        }
      }}
      title={<StepperDialogTitle />}
      content={
        <div className={cx('u-flex u-flex-column u-flex-justify-center')}>
          <ScanResultTitle />
          {tooltip && (
            <ScanResultInfo
              icon={illustration}
              text={t(`Acquisition.tooltip.${page}`)}
              className="u-mb-1"
            />
          )}
          <ScanResultCard
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            rotationImage={rotationImage}
            setRotationImage={setRotationImage}
            ref={imageRef}
          />
        </div>
      }
      actions={
        <>
          <Button
            data-testid="next-button"
            fullWidth
            label={t('common.next')}
            onClick={handleNextStep}
          />
          {multipage && (
            <ButtonLink
              className="u-ml-0 u-mb-half"
              data-testid="repeat-button"
              extension="full"
              theme="secondary"
              icon="camera"
              label={t('Acquisition.repeat')}
              onClick={handleRepeatStep}
            />
          )}
        </>
      }
      actionsLayout="column"
    />
  )
}

export default ScanResultDialog
