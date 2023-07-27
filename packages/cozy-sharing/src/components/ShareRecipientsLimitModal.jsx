import PropTypes from 'prop-types'
import React from 'react'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { computeRecipientsLimit } from '../helpers/recipients'

/**
 * Alert the user when the number of recipients for sharing a document has reached the limit
 */
const ShareRecipientsLimitModal = ({ documentName, onConfirm }) => {
  const { t } = useI18n()

  const limit = computeRecipientsLimit()

  return (
    <ConfirmDialog
      open
      title={t('ShareRecipientsLimitModal.title')}
      content={t('ShareRecipientsLimitModal.content', {
        documentName,
        limit
      })}
      actions={
        <Buttons
          label={t('ShareRecipientsLimitModal.confirm')}
          onClick={onConfirm}
          fullWidth
        />
      }
    />
  )
}

ShareRecipientsLimitModal.propTypes = {
  /** Name of the document shared */
  documentName: PropTypes.string.isRequired
}

export { ShareRecipientsLimitModal }
