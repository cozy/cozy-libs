import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import { nativeLinkOpen } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Button'

import { generateOnboardingQueryPart } from '../utils/onboarding'

const MANAGER_URL = 'https://manager.cozycloud.cc/cozy/create'

export class ButtonLinkRegistration extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  state = {
    url: ''
  }
  async generateUrl() {
    const oauthOptions = await generateOnboardingQueryPart(
      this.props.client.options.oauth
    )
    const url = `${MANAGER_URL}?onboarding=${oauthOptions}`
    this.setState({ url })
    return url
  }

  async handleClick() {
    const generatedUrl = await this.generateUrl()
    return nativeLinkOpen({ url: generatedUrl })
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
        onClick={this.handleClick}
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

export const DumbButtonRegistration = ButtonLinkRegistration
export default withClient(ButtonLinkRegistration)
