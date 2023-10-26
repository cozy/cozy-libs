import React from 'react'

import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import OcrProcessingIcon from '../../../assets/icons/OcrProcessing.svg'

const OcrProcessingDialog = ({ onBack }) => {
  const { t } = useI18n()

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

export default OcrProcessingDialog
