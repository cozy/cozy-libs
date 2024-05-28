import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import modalStyles from '../../styles/share.styl'

/**
 * Displays the confirmation interface that allows to confirm or reject a recipient
 */
const RecipientConfirm = ({ recipientConfirmationData, verifyRecipient }) => {
  const { t } = useI18n()

  const verify = () => {
    verifyRecipient(recipientConfirmationData)
  }

  return (
    <Button
      style={{ position: 'initial' }} // fix z-index bug on iOS when under a BottomDrawer due to relative position
      variant="text"
      className={modalStyles['aligned-dropdown-button']}
      onClick={verify}
      label={t(`Share.twoStepsConfirmation.verify`)}
    />
  )
}

RecipientConfirm.propTypes = {
  recipientConfirmationData: PropTypes.object.isRequired,
  verifyRecipient: PropTypes.func.isRequired
}

export default RecipientConfirm
