import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import ScanResultActions from './ScanResultActions'
import ScanResultCard from './ScanResultCard'
import ScanResultInfo from './ScanResultInfo'
import ScanResultTitle from './ScanResultTitle'
import { PaperDefinitionsStepPropTypes } from '../../constants/PaperDefinitionsPropTypes'
import { KEYS } from '../../constants/const'
import { useStepperDialog } from '../Hooks/useStepperDialog'

const ScanResultWrapper = ({ currentFile, setCurrentFile, currentStep }) => {
  const { page = 'default', illustration } = currentStep
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { nextStep } = useStepperDialog()

  const handleKeyDown = ({ key }) => {
    if (key === KEYS.ENTER) nextStep()
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
        />
      </div>
      <ScanResultActions
        currentStep={currentStep}
        onNextStep={nextStep}
        onRepeatStep={() => setCurrentFile(null)}
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
