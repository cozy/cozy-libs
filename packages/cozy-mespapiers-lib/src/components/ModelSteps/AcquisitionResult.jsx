import React, { memo, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import cx from 'classnames'

import Card from 'cozy-ui/transpiled/react/Card'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Button, { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import { useFormData } from '../Hooks/useFormData'
import { PaperDefinitionsStepPropTypes } from '../../constants/PaperDefinitionsPropTypes'
import { KEYS } from '../../constants/const'

const isPDF = file => file.type === 'application/pdf'

const useStyles = makeStyles(() => ({
  img: {
    maxWidth: '100%',
    maxHeight: 'inherit'
  },
  avatar: {
    color: 'var(--paperBackgroundColor)',
    backgroundColor: 'var(--successColor)',
    marginBottom: '1rem'
  }
}))

const AcquisitionResult = ({ currentFile, setCurrentFile, currentStep }) => {
  const styles = useStyles()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { nextStep } = useStepperDialog()
  const { setFormData, formData } = useFormData()
  const { page, multipage, stepIndex } = currentStep

  useEffect(() => {
    const hasAlreadyFile = formData.data.some(
      d => d.stepIndex === stepIndex && d.file.name === currentFile.name
    )
    if (!hasAlreadyFile) {
      setFormData(prev => ({
        ...prev,
        data: [
          ...prev.data,
          {
            file: currentFile,
            stepIndex,
            fileMetadata: {
              page: !multipage ? page : '',
              multipage
            }
          }
        ]
      }))
    }
  }, [formData.data, stepIndex, currentFile, multipage, page, setFormData])

  const changeSelectedFile = () => {
    const newData = formData.data.filter(
      data => data.file.name !== currentFile.name
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
        <div className={'u-flex u-flex-column u-flex-items-center u-mb-2'}>
          <Avatar icon={'check'} size="xlarge" className={styles.avatar} />
          <Typography variant={'h5'}>{t('Acquisition.success')}</Typography>
        </div>
        <Card className={'u-ta-center u-p-1 u-pb-half'}>
          <div className={'u-mah-5'}>
            {!isPDF(currentFile) ? (
              <img
                src={URL.createObjectURL(currentFile)}
                className={styles.img}
              />
            ) : (
              <>
                <Icon icon="file-type-pdf" size={80} />
                <Typography variant={'body1'}>{currentFile.name}</Typography>
              </>
            )}
          </div>
          <Button
            className={'u-mt-half'}
            data-testid="retry-button"
            label={t('Acquisition.retry')}
            theme={'text'}
            onClick={changeSelectedFile}
          />
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
          extension="full"
          label={t('common.next')}
          onClick={() => onValid(false)}
        />
        {multipage && (
          <ButtonLink
            className={'u-ml-0 u-mb-half'}
            data-testid="repeat-button"
            extension="full"
            theme={'secondary'}
            icon={'camera'}
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

export default memo(AcquisitionResult)
