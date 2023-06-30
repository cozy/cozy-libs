import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { usePaywall } from '../../../Contexts/PaywallProvider'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanFlagshipActions = ({
  onOpenFilePickerModal,
  onChangeFile,
  onOpenFlagshipScan
}) => {
  const { t } = useI18n()
  const { isPaywallActivated, setShowPaywall } = usePaywall()

  const handleEvent = (evt, callback) => {
    if (isPaywallActivated) {
      setShowPaywall(true)
    } else {
      callback(evt)
    }
  }

  return (
    <>
      <div>
        <Divider textAlign="center" className="u-mv-1">
          {t('Scan.divider')}
        </Divider>
        <Button
          variant="secondary"
          style={styleBtn}
          onClick={evt => handleEvent(evt, onOpenFilePickerModal)}
          startIcon={<Icon icon="folder-moveto" />}
          label={t('Scan.selectPicFromCozy')}
          data-testid="selectPicFromCozy-btn"
        />
        <FileInput
          onChange={evt => handleEvent(evt, onChangeFile)}
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
      <Button
        onClick={evt => handleEvent(evt, onOpenFlagshipScan)}
        startIcon={<Icon icon="camera" />}
        fullWidth
        className="u-m-0"
        label={t('Scan.takePic')}
        data-testid="importPicFromFlagshipScan-btn"
      />
    </>
  )
}

ScanFlagshipActions.propTypes = {
  onChangeFile: PropTypes.func,
  onOpenFilePickerModal: PropTypes.func,
  onOpenFlagshipScan: PropTypes.func
}

export default ScanFlagshipActions
