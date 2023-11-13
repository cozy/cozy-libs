import PropTypes from 'prop-types'
import React from 'react'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { forwardFile } from '../Actions/utils'

const ForwardModal = ({ onClose, onForward, fileToForward }) => {
  const client = useClient()
  const { t } = useI18n()

  const handleClick = async () => {
    await forwardFile(client, [fileToForward], t)
    onForward && onForward()
  }

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      content={
        <>
          <div className="u-ta-center u-mb-1">
            <Icon icon="file-type-zip" size={64} />
          </div>
          <Typography>{t('ForwardModal.content')}</Typography>
        </>
      }
      actions={
        <Button label={t('ForwardModal.action')} onClick={handleClick} />
      }
    />
  )
}

ForwardModal.propTypes = {
  onForward: PropTypes.func,
  onClose: PropTypes.func,
  fileToForward: PropTypes.object
}

export default ForwardModal
