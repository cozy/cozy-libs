import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useState, useRef } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Card from 'cozy-ui/transpiled/react/Card'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import AcquisitionResultInfo from './AcquisitionResultInfo'
import { isSameFile } from './helpers'
import RotateImage from './widgets/RotateImage'
import { PaperDefinitionsStepPropTypes } from '../../constants/PaperDefinitionsPropTypes'
import { KEYS } from '../../constants/const'
import { useFormData } from '../Hooks/useFormData'
import { useStepperDialog } from '../Hooks/useStepperDialog'

const isPDF = file => file.type === 'application/pdf'

const useStyles = makeStyles(theme => ({
  typography: {
    color: 'var(--successColor)',
    marginLeft: '0.5rem'
  },
  iconRetry: {
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: 0,
    '&.small': {
      padding: '0 1rem'
    }
  }
}))

const AcquisitionResult = ({ currentFile, setCurrentFile, currentStep }) => {
  const imageRef = useRef(null)
  const styles = useStyles()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { nextStep } = useStepperDialog()
  const { setFormData, formData } = useFormData()
  const [rotationImage, setRotationImage] = useState(0)

  const { multipage, illustration, page = 'default' } = currentStep

  const changeSelectedFile = () => {
    const newData = formData.data.filter(
      data => !isSameFile(currentFile, data.file)
    )

    setFormData(prev => ({
      ...prev,
      data: newData
    }))

    setCurrentFile(null)
  }

  const onValid = useCallback(
    (repeat = false) => {
      if (!repeat) nextStep()
      else setCurrentFile(null)
    },
    [nextStep, setCurrentFile]
  )

  const handleKeyDown = useCallback(
    ({ key }) => {
      if (key === KEYS.ENTER) onValid()
    },
    [onValid]
  )

  const handleRotate = () => {
    setRotationImage(prev => (prev - 90) % 360)
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
        <div className="u-flex u-flex-items-center u-flex-justify-center u-mb-1-half">
          <Icon
            icon="check-circle"
            color="var(--successColor)"
            aria-hidden="true"
          />
          <Typography variant="h4" className={styles.typography} role="status">
            {t('Acquisition.success')}
          </Typography>
        </div>
        <AcquisitionResultInfo
          icon={illustration}
          text={t(`Acquisition.tooltip.${page}`)}
          className="u-mb-1"
        />
        <Card className="u-ta-center u-p-1">
          <div className="u-mah-5">
            {!isPDF(currentFile) ? (
              <RotateImage
                image={URL.createObjectURL(currentFile)}
                rotation={rotationImage}
                a11n={{ 'aria-hidden': true }}
                ref={imageRef}
              />
            ) : (
              <>
                <Icon icon="file-type-pdf" size={80} aria-hidden="true" />
                <Typography>{currentFile.name}</Typography>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button
              data-testid="retry-button"
              label={t('Acquisition.retry')}
              fullWidth
              variant="secondary"
              onClick={changeSelectedFile}
            />
            <IconButton
              data-testid="rotate-button"
              classes={{ root: styles.iconRetry }}
              size="small"
              onClick={handleRotate}
              aria-label={t('Acquisition.rotate')}
              title={t('Acquisition.rotate')}
            >
              <Icon icon="rotate-left" />
            </IconButton>
          </div>
        </Card>
      </div>
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
          fullWidth
          label={t('common.next')}
          onClick={() => onValid(false)}
        />
        {multipage && (
          <Button
            className="u-ml-0 u-mb-half"
            data-testid="repeat-button"
            fullWidth
            variant="secondary"
            icon="camera"
            label={t('Acquisition.repeat')}
            onClick={() => onValid(true)}
          />
        )}
      </DialogActions>
    </>
  )
}

AcquisitionResult.propTypes = {
  currentFile: PropTypes.object.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
  currentStep: PaperDefinitionsStepPropTypes
}

export default AcquisitionResult
