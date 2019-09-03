import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

class KonnectorIcon extends PureComponent {
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

KonnectorIcon.propTypes = {
  konnector: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired
}
export default withClient(KonnectorIcon)
