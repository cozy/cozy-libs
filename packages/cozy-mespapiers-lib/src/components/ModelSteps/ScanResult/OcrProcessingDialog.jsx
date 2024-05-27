import merge from 'lodash/merge'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { useWebviewIntent } from 'cozy-intent'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import SelectPaperVersion from './SelectPaperVersion'
import OcrProcessingIcon from '../../../assets/images/OcrProcessing.svg'
import { useFormData } from '../../Hooks/useFormData'
import { useStepperDialog } from '../../Hooks/useStepperDialog'
import {
  getAttributesFromOcr,
  getDefaultSelectedVersion,
  getFormDataFilesForOcr,
  getOcrFromFlagship,
  makeMetadataFromOcr
} from '../helpers'

// TODO : To improve, the general idea is that for articles with several versions, there is not systematically the SelectPaperVersion modal which appears to ask the user to confirm the version. But to be able to activate it only for certain papers.
const SHOULD_ASK_CONFIRMATION = false

const OcrProcessingDialog = ({ onBack, rotatedFile }) => {
  const { t } = useI18n()
  const { setFormData, formData } = useFormData()
  const webviewIntent = useWebviewIntent()
  const { currentDefinition, nextStep } = useStepperDialog()
  const [multipleVersion, setMultipleVersion] = useState({
    enabled: false,
    ocr: null
  })
  const { ocrAttributes } = currentDefinition

  useEffect(() => {
    const init = async () => {
      const fileSides = getFormDataFilesForOcr(formData, rotatedFile)
      const ocrFromFlagship = await getOcrFromFlagship(fileSides, webviewIntent)
      const fileVersions = ocrAttributes.map(attr => attr.version)
      let ocrAttributesSelected = ocrAttributes[0]

      // If paper has multiple versions, we need to display a dialog to let user confirm the right version
      if (fileVersions.length > 1) {
        if (SHOULD_ASK_CONFIRMATION) {
          setMultipleVersion({ enabled: true, ocr: ocrFromFlagship })
          return
        }
        const selectedVersion = getDefaultSelectedVersion({
          ocrFromFlagship,
          ocrAttributes
        })

        ocrAttributesSelected = ocrAttributes.find(
          attr => attr.version === selectedVersion
        )
      }

      // If paper has no multiple versions, we can go to next step
      const attributesFound = getAttributesFromOcr(
        ocrFromFlagship,
        ocrAttributesSelected
      )

      const metadataFromOcr = makeMetadataFromOcr(attributesFound)
      setFormData(prev => merge({}, prev, { metadata: metadataFromOcr }))

      nextStep()
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (multipleVersion.enabled) {
    return (
      <SelectPaperVersion
        onBack={onBack}
        ocrFromFlagship={multipleVersion.ocr}
      />
    )
  }

  return (
    <Dialog
      open
      onBack={onBack}
      transitionDuration={0}
      content={
        <Empty
          centered
          className="u-ph-1"
          icon={<img src={OcrProcessingIcon} />}
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
