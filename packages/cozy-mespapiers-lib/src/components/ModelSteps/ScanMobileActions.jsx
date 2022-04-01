import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Camera from 'cozy-ui/transpiled/react/Icons/Camera'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FolderMoveto from 'cozy-ui/transpiled/react/Icons/FolderMoveto'
import PhoneUpload from 'cozy-ui/transpiled/react/Icons/PhoneUpload'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanMobileActions = ({ openFilePickerModal, onChangeFile }) => {
  const { t } = useI18n()

  return (
    <>
      <div>
        <Divider textAlign="center" className={'u-mv-1'}>
          {t('Scan.divider')}
        </Divider>
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
          data-testid="importPicFromMobile-btn"
        >
          <Button
            variant={'secondary'}
            component={'a'}
            style={styleBtn}
            startIcon={<Icon icon={PhoneUpload} />}
            fullWidth
            className={'u-m-0'}
            label={t('Scan.importPicFromMobile')}
          />
        </FileInput>
      </div>
      <FileInput
        onChange={onChangeFile}
        className={'u-w-100 u-ta-center u-ml-0'}
        onClick={e => e.stopPropagation()}
        capture={'environment'}
        accept={'image/*'}
        data-testid="takePic-btn"
      >
        <Button
          startIcon={<Icon icon={Camera} />}
          component={'a'}
          fullWidth
          className={'u-m-0'}
          label={t('Scan.takePic')}
        />
      </FileInput>
    </>
  )
}

export default ScanMobileActions
