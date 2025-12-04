import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'
import { useI18n } from 'twake-i18n'

import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import ActionMenuDesktop from './ActionMenuDesktop'
import ActionMenuMobile from './ActionMenuMobile'
import { isEditableAttribute } from '../helpers'
import { useViewer } from '../providers/ViewerProvider'

const ActionMenuWrapper = forwardRef(
  ({ optionFile, isReadOnly, onClose }, ref) => {
    const { name, value } = optionFile
    const { isMobile } = useBreakpoints()
    const { file } = useViewer()
    const { t } = useI18n()
    const { showAlert } = useAlert()

    const isEditable = isEditableAttribute(name, file) && !isReadOnly
    const editPath =
      name === 'contact'
        ? `${file.metadata.qualification.label}/${file._id}/edit/contact`
        : `${file.metadata.qualification.label}/${file._id}/edit/information?metadata=${optionFile.name}`

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value)
        showAlert({
          message: t(`Viewer.snackbar.copiedToClipboard.success`),
          severity: 'success',
          variant: 'filled',
          icon: false
        })
      } catch (error) {
        showAlert({
          message: t(`Viewer.snackbar.copiedToClipboard.error`),
          severity: 'error',
          variant: 'filled',
          icon: false
        })
      }
      onClose()
    }

    if (isMobile) {
      return (
        <ActionMenuMobile
          actions={{
            copy: { onClick: handleCopy },
            edit: { path: editPath }
          }}
          isEditable={isEditable}
          onClose={onClose}
        />
      )
    }

    return (
      <ActionMenuDesktop
        ref={ref}
        actions={{
          copy: { onClick: handleCopy },
          edit: { path: editPath }
        }}
        isEditable={isEditable}
        onClose={onClose}
      />
    )
  }
)

ActionMenuWrapper.displayName = 'ActionMenuWrapper'

ActionMenuWrapper.propTypes = {
  file: PropTypes.object,
  optionFile: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  isReadOnly: PropTypes.bool,
  onClose: PropTypes.func
}

export default ActionMenuWrapper
