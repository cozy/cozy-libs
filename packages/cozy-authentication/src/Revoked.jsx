import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withClient } from 'cozy-client'

const Revoked = ({ t, onLogBackIn, onLogout }) => (
  <Modal
    into="body"
    title={t('mobile.revoked.title')}
    description={t('mobile.revoked.description')}
    primaryText={t('mobile.revoked.loginagain')}
    primaryAction={onLogBackIn}
    secondaryText={t('mobile.revoked.logout')}
    secondaryAction={onLogout}
    closable={false}
  />
)

Revoked.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onLogBackIn: PropTypes.func.isRequired
}

export default withClient(translate()(Revoked))
