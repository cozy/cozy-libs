import React, { useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types'

import Card from 'cozy-ui/transpiled/react/Card'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Button, { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import FileTypePdfIcon from 'cozy-ui/transpiled/react/Icons/FileTypePdf'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Check from 'cozy-ui/transpiled/react/Icons/Check'
import Camera from 'cozy-ui/transpiled/react/Icons/Camera'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import { useFormData } from '../Hooks/useFormData'
import { PaperDefinitionsStepPropTypes } from '../../constants/PaperDefinitionsPropTypes'

const isPDF = file => file.type === 'application/pdf'

const AcquisitionResult = ({ file, setFile, currentStep }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { nextStep } = useStepperDialog()
  const { setFormData } = useFormData()
  const { page, multipage } = currentStep

  const onValid = useCallback(
    (repeat = false) => {
      setFormData(prev => ({
        ...prev,
        data: [
          ...prev.data,
          {
            file,
            fileMetadata: {
              page: !multipage ? page : '',
              multipage
            }
          }
        ]
      }))
      if (!repeat) nextStep()
      else setFile(null)
    },
    [multipage, page, nextStep, setFile, setFormData, file]
  )

  const handleKeyDown = useCallback(
    ({ key }) => {
      if (key === 'Enter') onValid()
    },
    [onValid]
  )

  useEventListener(window, 'keydown', handleKeyDown)

  const style = useMemo(
    () => ({
      img: {
        maxWidth: '100%',
        maxHeight: 'inherit'
      },
      avatar: {
        color: 'var(--paperBackgroundColor)',
        backgroundColor: 'var(--successColor)'
      }
    }),
    []
  )

  return (
    <>
      <div className={'u-h-100 u-flex u-flex-column u-flex-justify-center'}>
        <div className={!isMobile ? 'u-mh-2' : ''}>
          <div className={'u-flex u-flex-column u-flex-items-center u-mb-2'}>
            <Avatar
              icon={Check}
              size="xlarge"
              style={style.avatar}
              className={'u-mb-1'}
            />
            <Typography variant={'h5'}>{t('Acquisition.success')}</Typography>
          </div>
          <Button
            className={'u-mt-half'}
            data-testid="retry-button"
            label={t('Acquisition.retry')}
            theme={'text'}
            onClick={() => setFile(null)}
          />
        </Card>
      </div>
      <DialogActions
        disableSpacing
        className={'columnLayout u-mh-0 u-mb-1 cozyDialogActions'}
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
            icon={Camera}
            label={t('Acquisition.repeat')}
            onClick={() => onValid(true)}
          />
        )}
      </DialogActions>
    </>
  )
}

AcquisitionResult.propTypes = {
  file: PropTypes.object.isRequired,
  setFile: PropTypes.func.isRequired,
  currentStep: PaperDefinitionsStepPropTypes
}

export default memo(AcquisitionResult)
