import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { forwardFile } from '../Actions/utils'

const ForwardModal = ({ onClose, onForward }) => {
  const client = useClient()
  const { t } = useI18n()

  const handleClick = async file => {
    await forwardFile(client, [file], t)
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
        <Button
          label={t('ForwardModal.action')}
          onClick={handleClick}
        />
      }
    />
  )
}

ForwardModal.propTypes = {
  onForward: PropTypes.func,
  onClose: PropTypes.func
}

export default ForwardModal
