import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import snarkdown from 'snarkdown'

import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '../styles/CozyPassFingerprintDialogContent.styl'

/**
 * CozyPassFingerprintDialogContent can be use as a content for ShareModal when
 * using 2 steps confirmation
 *
 * This should be the case when ShareModal is called from `cozy-pass-web`
 */
export const CozyPassFingerprintDialogContent = ({
  recipientConfirmationData
}) => {
  const { t } = useI18n()

  const instruction1 = snarkdown(
    t(`Organizations.fingerprint.instruction`, {
      userName: recipientConfirmationData.name,
      userEmail: recipientConfirmationData.email
    })
  )

  const instruction2 = snarkdown(t(`Organizations.fingerprint.instruction2`))

  return (
    <div className={cx(styles['share-modal-content'])}>
      <p dangerouslySetInnerHTML={{ __html: instruction1 }}></p>
      <Paper
        className={cx(styles['cozy-pass-fingerprint-modal__fingerprint'])}
        elevation={1}
      >
        <Typography variant="body1">
          {recipientConfirmationData.fingerprintPhrase}
        </Typography>
      </Paper>
      <p dangerouslySetInnerHTML={{ __html: instruction2 }}></p>
    </div>
  )
}

CozyPassFingerprintDialogContent.propTypes = {
  recipientConfirmationData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    fingerprintPhrase: PropTypes.string.isRequired
  })
}
