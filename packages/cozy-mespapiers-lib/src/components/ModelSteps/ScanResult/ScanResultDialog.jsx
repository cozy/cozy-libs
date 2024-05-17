import cx from 'classnames'
import React, { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import PointerAlert from 'cozy-ui/transpiled/react/PointerAlert'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import OcrProcessingDialog from './OcrProcessingDialog'
import ScanResultCard from './ScanResultCard'
import ScanResultTitle from './ScanResultTitle'
import { FLAGSHIP_SCAN_TEMP_FILENAME, KEYS } from '../../../constants/const'
import { isFlagshipOCRAvailable } from '../../../helpers/isFlagshipOCRAvailable'
import { isSomePaperStepsCompliantWithOCR } from '../../../helpers/isSomePaperStepsCompliantWithOCR'
import CompositeHeaderImage from '../../CompositeHeader/CompositeHeaderImage'
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
  const webviewIntent = useWebviewIntent()
  const [searchParams] = useSearchParams()
  const { isDesktop } = useBreakpoints()

  const device = isDesktop ? 'desktop' : 'mobile'
  const imageRef = useRef(null)
  const [rotationImage, setRotationImage] = useState(0)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const {
    currentStepIndex,
    nextStep,
    isLastStep,
    allCurrentSteps,
    currentDefinition
  } = useStepperDialog()

  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')
  let currentFileRotated

  const onValid = async addPage => {
    // If the image has changed rotation, the process has changed it to base64, so we need to transform it back into File before saving it in the formData
    if (rotationImage % 360 !== 0) {
      currentFileRotated = makeFileFromBase64({
        source: imageRef.current.src,
        name: currentFile.name,
        type: currentFile.type
      })
      onChangeFile(currentFileRotated, { replace: true })
    }

    if (addPage) {
      setCurrentFile(null)
    } else {
      const isOcrPaperAvailable =
        !fromFlagshipUpload &&
        currentFile.name === FLAGSHIP_SCAN_TEMP_FILENAME && // The file must have been passed through the flagship scanner
        isLastStep('scan') &&
        isSomePaperStepsCompliantWithOCR(allCurrentSteps) &&
        !!currentDefinition.ocrAttributes

      if (isOcrPaperAvailable) {
        const OcrActivated = await isFlagshipOCRAvailable(webviewIntent)
        if (OcrActivated) {
          setOcrProcessing(true)
        }
      } else {
        nextStep()
      }
    }
  }

  const handleNextStep = async () => await onValid(false)
  const handleRepeatStep = async () => await onValid(true)

  const handleKeyDown = ({ key }) => {
    if (key === KEYS.ENTER) handleNextStep()
  }

  useEventListener(window, 'keydown', handleKeyDown)

  if (ocrProcessing) {
    return (
      <OcrProcessingDialog rotatedFile={currentFileRotated} onBack={onBack} />
    )
  }

  return (
    <FixedDialog
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
            <PointerAlert
              className="u-mb-1"
              icon={
                <CompositeHeaderImage icon={illustration} iconSize="small" />
              }
            >
              {t(`Acquisition.${device}.tooltip.${page}`)}
            </PointerAlert>
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
