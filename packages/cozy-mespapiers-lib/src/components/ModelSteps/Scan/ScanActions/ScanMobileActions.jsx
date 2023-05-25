import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import InstallAppModal from '../InstallAppModal'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanMobileActions = ({ onOpenFilePickerModal, onChangeFile }) => {
  const [showInstallAppModal, setShowInstallAppModal] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <div>
        <Divider textAlign="center" className="u-mv-1">
          {t('Scan.divider')}
        </Divider>
        <Button
          variant="secondary"
          style={styleBtn}
          onClick={onOpenFilePickerModal}
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
      <Button
        startIcon={<Icon icon="camera" />}
        onClick={() => setShowInstallAppModal(true)}
        fullWidth
        className="u-m-0"
        label={t('Scan.takePic')}
        data-testid="takePic-btn"
      />

      {showInstallAppModal && (
        <InstallAppModal onBack={() => setShowInstallAppModal(false)} />
      )}
    </>
  )
}

ScanMobileActions.propTypes = {
  onChangeFile: PropTypes.func,
  onOpenFilePickerModal: PropTypes.func
}

export default ScanMobileActions
