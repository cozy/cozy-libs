import PropTypes from 'prop-types'
import React, { useRef } from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { forwardByShare, forwardByLink } from '../Actions/Items'

const ShareMenu = ({
  docs,
  setFileToForward,
  setIsBackdropOpen,
  setZipFolder,
  shareFiles,
  onClose
}) => {
  const { t, f } = useI18n()
  const ref = useRef(null)
  const { showAlert } = useAlert()

  const onForwardSuccess = () => {
    showAlert(
      t('common.forwardFile.success', { smart_count: docs.length }),
      'success'
    )
  }

  const onForwardError = () => {
    showAlert(t('common.forwardFile.error'), 'error')
  }

  const actions = makeActions([forwardByShare, forwardByLink], {
    t,
    f,
    docs,
    shareFiles,
    setFileToForward,
    setIsBackdropOpen,
    setZipFolder,
    onForwardSuccess,
    onForwardError
  })

  return (
    <ActionsMenu
      ref={ref}
      open
      docs={docs}
      actions={actions}
      autoClose
      onClose={onClose}
    />
  )
}

ShareMenu.propTypes = {
  docs: PropTypes.array,
  setFileToForward: PropTypes.func,
  setIsBackdropOpen: PropTypes.func,
  setZipFolder: PropTypes.func,
  shareFiles: PropTypes.func,
  onClose: PropTypes.func
}

export default ShareMenu
