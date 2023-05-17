import PropTypes from 'prop-types'
import React, { createRef } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import { KEYS } from '../../constants/const'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanDesktopActions = ({ onOpenFilePickerModal, onChangeFile }) => {
  const { t } = useI18n()
  const buttonRef = createRef()

  const handleKeyDown = ({ key }) => {
    if (key === KEYS.ENTER && buttonRef.current) {
      buttonRef.current.click()
    }
  }

  useEventListener(window, 'keydown', handleKeyDown)

  return (
    <>
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
        data-testid="importPicFromDesktop-btn"
      >
        <Button
          startIcon={<Icon icon="phone-upload" />}
          component="a"
          ref={buttonRef}
          className="u-w-100 u-m-0 u-mb-1"
          label={t('Scan.importPicFromDesktop')}
        />
      </FileInput>
    </>
  )
}

ScanDesktopActions.propTypes = {
  onChangeFile: PropTypes.func,
  onOpenFilePickerModal: PropTypes.func
}

export default ScanDesktopActions
