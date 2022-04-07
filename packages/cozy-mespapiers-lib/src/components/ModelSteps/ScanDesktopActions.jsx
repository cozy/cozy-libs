import React, { useCallback, createRef } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FolderMoveto from 'cozy-ui/transpiled/react/Icons/FolderMoveto'
import PhoneUpload from 'cozy-ui/transpiled/react/Icons/PhoneUpload'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanDesktopActions = ({ openFilePickerModal, onChangeFile }) => {
  const { t } = useI18n()
  const buttonRef = createRef()

  const handleKeyDown = useCallback(
    ({ key }) => {
      if (key === 'Enter' && buttonRef.current) {
        buttonRef.current.click()
      }
    },
    [buttonRef]
  )

  useEventListener(window, 'keydown', handleKeyDown)

  return (
    <>
      <Button
        variant="secondary"
        style={styleBtn}
        onClick={openFilePickerModal}
        startIcon={<Icon icon={FolderMoveto} />}
        label={t('Scan.selectPicFromCozy')}
        data-testid="selectPicFromCozy-btn"
      />
      <FileInput
        onChange={onChangeFile}
        className={'u-w-100 u-ml-0'}
        onClick={e => e.stopPropagation()}
        accept={'image/*,.pdf'}
        data-testid="importPicFromDesktop-btn"
      >
        <Button
          startIcon={<Icon icon={PhoneUpload} />}
          component={'a'}
          ref={buttonRef}
          className={'u-w-100 u-m-0 u-mb-1'}
          label={t('Scan.importPicFromDesktop')}
        />
      </FileInput>
    </>
  )
}

export default ScanDesktopActions
