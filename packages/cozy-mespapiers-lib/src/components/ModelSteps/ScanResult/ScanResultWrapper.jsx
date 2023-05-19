import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef, memo } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import ScanResultActions from './ScanResultActions'
import ScanResultCard from './ScanResultCard'
import ScanResultInfo from './ScanResultInfo'
import ScanResultTitle from './ScanResultTitle'
import { PaperDefinitionsStepPropTypes } from '../../../constants/PaperDefinitionsPropTypes'
import { KEYS } from '../../../constants/const'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import { makeFileFromImageSource } from '../helpers'

const ScanResultWrapper = ({
  currentFile,
  setCurrentFile,
  currentStep,
  onChangeFile
}) => {
  const imageRef = useRef(null)
  const [rotationImage, setRotationImage] = useState(0)
  const { page = 'default', illustration } = currentStep
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { nextStep } = useStepperDialog()

  const onValid = async addPage => {
    if (rotationImage % 360 !== 0) {
      const newFile = await makeFileFromImageSource({
        imageSrc: imageRef.current.src,
        imageName: currentFile.name,
        imageType: currentFile.type
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
    <>
      <div
        className={cx(
          'u-h-100 u-mb-2 u-flex u-flex-column u-flex-justify-center',
          {
            ['u-mt-2 u-mh-1']: !isMobile
          }
        )}
      >
        <ScanResultTitle />
        <ScanResultInfo
          icon={illustration}
          text={t(`Acquisition.tooltip.${page}`)}
          className="u-mb-1"
        />
        <ScanResultCard
          currentFile={currentFile}
          setCurrentFile={setCurrentFile}
          currentStep={currentStep}
          rotationImage={rotationImage}
          setRotationImage={setRotationImage}
          ref={imageRef}
        />
      </div>
      <ScanResultActions
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onRepeatStep={handleRepeatStep}
      />
    </>
  )
}

ScanResultWrapper.propTypes = {
  currentFile: PropTypes.object.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  currentStep: PaperDefinitionsStepPropTypes
}

export default memo(ScanResultWrapper)
