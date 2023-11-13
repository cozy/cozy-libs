import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import QRCodeModal from './QRCodeModal'
import IlluScanner from '../../../../assets/icons/IlluScanner.svg'

const ScanDesktopActionsAlert = ({ onClose }) => {
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)

  const { t } = useI18n()

  const handleInstallApp = () => {
    setShowQRCodeModal(true)
  }

  return (
    <>
      <Alert
        block
        icon={<Icon icon={IlluScanner} size={96} />}
        action={
          <>
            <Button
              component="a"
              onClick={onClose}
              variant="text"
              label={t('ScanDesktopActionsAlert.actions.hide')}
            />
            <Button
              component="a"
              onClick={handleInstallApp}
              variant="text"
              label={t('ScanDesktopActionsAlert.actions.install')}
            />
          </>
        }
        data-testid="ScanDesktopActionsAlert"
      >
        <AlertTitle>{t('ScanDesktopActionsAlert.title')}</AlertTitle>
        {t('ScanDesktopActionsAlert.text')}
      </Alert>

      {showQRCodeModal && (
        <QRCodeModal onClose={() => setShowQRCodeModal(false)} />
      )}
    </>
  )
}

ScanDesktopActionsAlert.propTypes = {
  onClose: PropTypes.func
}

export default ScanDesktopActionsAlert
