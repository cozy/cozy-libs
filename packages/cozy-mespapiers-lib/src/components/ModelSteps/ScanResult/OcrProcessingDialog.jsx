import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

import { useWebviewIntent } from 'cozy-intent'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import OcrProcessingIcon from '../../../assets/icons/OcrProcessing.svg'
import { useFormData } from '../../Hooks/useFormData'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import {
  getAttributesFromOcr,
  getFormDataFilesForOcr,
  getOcrFromFlagship,
  makeMetadataFromOcr
} from '../helpers'

const OcrProcessingDialog = ({ onBack, rotatedFile }) => {
  const { t } = useI18n()
  const { setFormData, formData } = useFormData()
  const webviewIntent = useWebviewIntent()
  const { currentDefinition, nextStep } = useStepperDialog()
  const { ocrAttributes } = currentDefinition

  useEffect(() => {
    const init = async () => {
      const fileSides = getFormDataFilesForOcr(formData, rotatedFile)
      const ocrFromFlagship = await getOcrFromFlagship(fileSides, webviewIntent)
      const attributesFound = getAttributesFromOcr(
        ocrFromFlagship,
        ocrAttributes[0]
      )

      const metadataFromOcr = makeMetadataFromOcr(attributesFound)
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...metadataFromOcr
        }
      }))

      nextStep()
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog
      open
      onBack={onBack}
      transitionDuration={0}
      content={
        <Empty
          centered
          className="u-ph-1"
          icon={OcrProcessingIcon}
          title={t('OcrProcessingDialog.title')}
          text={t('OcrProcessingDialog.text')}
        />
      }
    />
  )
}

OcrProcessingDialog.propTypes = {
  onBack: PropTypes.func.isRequired,
  rotatedFile: PropTypes.object
}

export default OcrProcessingDialog
