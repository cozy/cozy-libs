import React, { useEffect, useState } from 'react'

import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import Button from 'cozy-ui/transpiled/react/Buttons'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanMobileActions = ({ openFilePickerModal, onChangeFile }) => {
  const { t } = useI18n()
  const webviewIntent = useWebviewIntent()

  const [scannedDocument, setScannedDocument] = useState('')
  const [isScannerAvailable, setIsScannerAvailable] = useState(false)

  const scanDocument = async () => {
    const base64 = await webviewIntent.call('scanDocument')
    setScannedDocument(base64)
  }

  useEffect(() => {
    const checkScanDocument = async () => {
      const isAvailable = await webviewIntent.call('isScannerAvailable')
      setIsScannerAvailable(isAvailable)
    }
    checkScanDocument()
  }, [webviewIntent])

  return (
    <>
      <div>
        <img src={`data:image/png;base64, ${scannedDocument}`} />
        <Divider textAlign="center" className="u-mv-1">
          {t('Scan.divider')}
        </Divider>
        <Button
          variant="secondary"
          style={styleBtn}
          onClick={openFilePickerModal}
          startIcon={<Icon icon="folder-moveto" />}
          label={t('Scan.selectPicFromCozy')}
          data-testid="selectPicFromCozy-btn"
        />
        <FileInput
          onChange={onChangeFile}
          className="u-w-100 u-ml-0"
          onClick={e => e.stopPropagation()}
          accept={'image/*,.pdf'}
          data-testid="importPicFromMobile-btn"
        >
          <Button
            variant="secondary"
            component="a"
            style={styleBtn}
            startIcon={<Icon icon="phone-upload" />}
            fullWidth
            className="u-m-0"
            label={t('Scan.importPicFromMobile')}
          />
        </FileInput>
      </div>
      {isFlagshipApp() && isScannerAvailable ? (
        <Button
          onClick={scanDocument}
          startIcon={<Icon icon="camera" />}
          component="a"
          fullWidth
          className="u-m-0"
          label={t('Scan.takePic')}
        />
      ) : (
        <FileInput
          onChange={onChangeFile}
          className="u-w-100 u-ta-center u-ml-0"
          onClick={e => e.stopPropagation()}
          capture="environment"
          accept={'image/*'}
          data-testid="takePic-btn"
        >
          <Button
            startIcon={<Icon icon="camera" />}
            component="a"
            fullWidth
            className="u-m-0"
            label={t('Scan.takePic')}
          />
        </FileInput>
      )}
    </>
  )
}

export default ScanMobileActions
