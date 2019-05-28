import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/react/I18n'

import { prepareOAuth, checkOAuthData, terminateOAuth } from '../helpers/oauth'
import Popup from './Popup'

const OAUTH_POPUP_HEIGHT = 800
const OAUTH_POPUP_WIDTH = 800

/**
 * OAuth window is responsible for managing the OAuth process on the client
 * side, storing info into local storage, loading OAuth window and listening
 * for data from it.
 *
 * The goal of our OAuth Workflow is to retrieve an account id.
 *
 * The main part of our OAuth workflow is done by the stack, which redirects
 * to the OAuth provider authentification endpoint, handles redirection, creates
 * account and forwards the id of the created account.
 */
export class OAuthWindow extends PureComponent {
  state = {
    oAuthUrl: null,
    oAuthStateKey: null
  }

  constructor(props, context) {
    super(props, context)
    this.handleClose = this.handleClose.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
  }

  componentDidMount() {
    const { client, konnector } = this.props
    const { oAuthStateKey, oAuthUrl } = prepareOAuth(client, konnector)
    this.setState({ oAuthStateKey, oAuthUrl, succeed: false })
  }

  componentWillUnmount() {
    const { oAuthStateKey } = this.state
    terminateOAuth(oAuthStateKey)
  }

  handleClose() {
    const { succeed } = this.state
    if (succeed) return

    const { onCancel } = this.props
    if (typeof onCancel === 'function') onCancel()
  }

  handleMessage(messageEvent) {
    const { konnector, onSuccess } = this.props

    const { data } = messageEvent

    if (!checkOAuthData(konnector, data)) return
    this.setState({ succeed: true })

    if (typeof onSuccess !== 'function') return
    onSuccess(data.key)
  }

  render() {
    const { t } = this.props
    const { oAuthUrl } = this.state
    return (
      oAuthUrl && (
        <Popup
          url={oAuthUrl}
          height={OAUTH_POPUP_HEIGHT}
          width={OAUTH_POPUP_WIDTH}
          onMessage={this.handleMessage}
          onClose={this.handleClose}
          title={t(`oauth.window.title`)}
        />
      )
    )
  }
}

OAuthWindow.propTypes = {
  client: PropTypes.object.isRequired,
  /** Konnector document */
  konnector: PropTypes.object.isRequired,
  /** Callback called when an accout id is obtained at the end of the OAuth
  workflow */
  onSuccess: PropTypes.func,
  /** Callback called when the OAuth window is closed wihout having retrieved
  an account id */
  onCancel: PropTypes.func
}

export default translate()(withClient(OAuthWindow))
