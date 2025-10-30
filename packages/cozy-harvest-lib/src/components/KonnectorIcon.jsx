import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { withClient } from 'cozy-client'
import AppIcon from 'cozy-ui-plus/dist/AppIcon'

// TODO move this to cozy-ui
class KonnectorIcon extends PureComponent {
  render() {
    const { konnector, ...restProps } = this.props
    return <AppIcon type="konnector" app={konnector} {...restProps} />
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
