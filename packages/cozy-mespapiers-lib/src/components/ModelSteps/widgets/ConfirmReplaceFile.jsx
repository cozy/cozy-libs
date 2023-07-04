import PropTypes from 'prop-types'
import React, { memo, useCallback } from 'react'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'

const ConfirmReplaceFile = ({ onReplace, onClose, cozyFilesCount }) => {
  const { t } = useI18n()

  const onClickReplace = useCallback(
    isReplaced => () => {
      onReplace(isReplaced)
      onClose()
    },
    [onClose, onReplace]
  )

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={t('ConfirmReplaceFile.title', {
        smart_count: cozyFilesCount
      })}
      content={
        <>
          <Typography
            dangerouslySetInnerHTML={{
              __html: t('ConfirmReplaceFile.content')
            }}
          />
          <Typography>
            {t('ConfirmReplaceFile.question', {
              smart_count: cozyFilesCount
            })}
          </Typography>
        </>
      }
      actions={
        <>
          <Button
            theme="secondary"
            onClick={onClickReplace(false)}
            label={t('ConfirmReplaceFile.keep')}
          />
          <Button
            theme="primary"
            onClick={onClickReplace(true)}
            label={t('ConfirmReplaceFile.replace')}
          />
        </>
      }
    />
  )
}

ConfirmReplaceFile.propTypes = {
  onReplace: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  cozyFilesCount: PropTypes.number.isRequired
}

export default memo(ConfirmReplaceFile)
