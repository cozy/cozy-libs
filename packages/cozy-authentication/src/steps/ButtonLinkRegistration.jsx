import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getPlatform } from 'cozy-device-helper'
import { Button } from 'cozy-ui/transpiled/react'
import { withClient } from 'cozy-client'
//import flag from 'cozy-flags'

import { nativeLinkOpen } from '../LinkManager'

import {
  generateOnboardingQueryPart,
  clearState,
  clearSecret
} from '../utils/onboarding'

export class ButtonLinkRegistration extends Component {
  state = {
    url: ''
  }
  async generateUrl() {
    await clearState()
    await clearSecret()
    const oauthOptions = await generateOnboardingQueryPart(this.props.client.options.oauth)
    const url = `https://manager.cozycloud.cc/cozy/create?pk_campaign=drive-${getPlatform() ||
      'browser'}&onboarding=${oauthOptions}`
    this.setState({ url })
    return url
  }
  render() {
    const {
      className = '',
      label,
      size,
      subtle = false,
      type = 'submit',
      theme = 'primary'
    } = this.props
    const { url } = this.state
    return (
      <Button
        onClick={async () => {
          const generatedUrl = await this.generateUrl()
          return nativeLinkOpen({ url: generatedUrl })
        }}
        theme={theme}
        href={url}
        label={label}
        size={size}
        className={className}
        subtle={subtle}
        type={type}
      />
    )
  }
}

ButtonLinkRegistration.propTypes = {
  client: PropTypes.object.isRequired
}

export default withClient(ButtonLinkRegistration)
