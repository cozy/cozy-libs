import PropTypes from 'prop-types'
import React from 'react'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Modal from 'cozy-ui/transpiled/react/Modal'

import withLocales from './withLocales'

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

export default withLocales(withClient(translate()(Revoked)))
