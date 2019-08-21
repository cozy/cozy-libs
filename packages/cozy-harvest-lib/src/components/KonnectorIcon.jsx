import React, { Component } from 'react'
import { withClient } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

class KonnectorIcon extends Component {
  fetchIcon() {
    const { konnector, client } = this.props
    return client.getStackClient().getIconURL({
      type: 'konnector',
      slug: konnector.slug
    })
  }

  render() {
    return <AppIcon fetchIcon={this.fetchIcon.bind(this)} />
  }
}

export default withClient(KonnectorIcon)
