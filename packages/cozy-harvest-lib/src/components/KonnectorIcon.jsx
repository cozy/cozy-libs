import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withClient } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

// TODO move this to cozy-ui
class KonnectorIcon extends PureComponent {
  fetchIcon() {
    const { konnector, konnectorSlug, client } = this.props
    return client.getStackClient().getIconURL({
      type: 'konnector',
      slug: konnectorSlug || konnector.slug
    })
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { client, konnector, ...restProps } = this.props
    return <AppIcon fetchIcon={this.fetchIcon.bind(this)} {...restProps} />
  }
}

KonnectorIcon.propTypes = {
  konnector: PropTypes.object,
  konnectorSlug: PropTypes.string,
  client: PropTypes.object.isRequired,

  /**
   * PropTypes do not provide a good way to express that we want either one
   * propType or the other. This dummy props helps us express and still retain
   * the original PropType validation for the original properties.
   */
  eitherKonnectorOrKonnectorSlug: (props, propName, componentName) => {
    if (!props.konnector && !props.konnectorSlug) {
      return new Error(
        `One of props 'konnector' or 'konnectorSlug' was not specified in '${componentName}'.`
      )
    }
  }
}
export default withClient(KonnectorIcon)
