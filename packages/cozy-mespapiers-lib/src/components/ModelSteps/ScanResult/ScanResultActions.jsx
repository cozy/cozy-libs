import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button, { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { PaperDefinitionsStepPropTypes } from '../../../constants/PaperDefinitionsPropTypes'

const ScanResultActions = ({ currentStep, onNextStep, onRepeatStep }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { multipage } = currentStep

  return (
    <DialogActions
      disableSpacing
      className={cx('columnLayout u-mb-1-half u-mt-0 cozyDialogActions', {
        'u-mh-1': !isMobile,
        'u-mh-0': isMobile
      })}
    >
      <Button
        className="u-db"
        data-testid="next-button"
        extension="full"
        label={t('common.next')}
        onClick={onNextStep}
      />
      {multipage && (
        <ButtonLink
          className="u-ml-0 u-mb-half"
          data-testid="repeat-button"
          extension="full"
          theme="secondary"
          icon="camera"
          label={t('Acquisition.repeat')}
          onClick={onRepeatStep}
        />
      )}
    </DialogActions>
  )
}

ScanResultActions.propTypes = {
  onNextStep: PropTypes.func,
  onRepeatStep: PropTypes.func,
  currentStep: PaperDefinitionsStepPropTypes
}

export default ScanResultActions
