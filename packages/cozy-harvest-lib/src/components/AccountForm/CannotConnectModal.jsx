import React from 'react'
import PropTypes from 'prop-types'

import Typography from 'cozy-ui/transpiled/react/Typography'
import Link from 'cozy-ui/transpiled/react/Link'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const CannotConnectModal = ({ vendorName, vendorLink, onClose }) => {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open
      content={
        <>
          <Typography variant="h4" className="u-mb-1">
            {t('accountForm.cannotConnectModal.title')}
          </Typography>
          <Typography className="u-mb-1">
            {t('accountForm.cannotConnectModal.content')}
            <Link href={vendorLink} target="_blank" rel="noopener noreferrer">
              {vendorName}
            </Link>
          </Typography>
        </>
      }
      onClose={onClose}
    />
  )
}

CannotConnectModal.propTypes = {
  vendorName: PropTypes.string,
  vendorLink: PropTypes.string,
  onClose: PropTypes.func
}

export default CannotConnectModal
