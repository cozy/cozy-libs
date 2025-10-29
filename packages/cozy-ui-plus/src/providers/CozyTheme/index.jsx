import PropTypes from 'prop-types'
import React from 'react'

import { isRsg } from 'cozy-ui/transpiled/react/hooks/useSetFlagshipUi/helpers'
import DumbCozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
export { useCozyTheme } from 'cozy-ui/transpiled/react/providers/CozyTheme'

import CozyThemeWithQuery from './CozyThemeWithQuery'

const CozyTheme = ({ ignoreCozySettings, ...props }) => {
  const Comp =
    ignoreCozySettings || process.env.NODE_ENV === 'test' || isRsg
      ? DumbCozyTheme
      : CozyThemeWithQuery

  return <Comp {...props} />
}

CozyTheme.propTypes = {
  variant: PropTypes.oneOf(['normal', 'inverted']),
  /** Causes this element's children to appear as if they were direct children of the element's parent, ignoring the element itself. */
  ignoreItself: PropTypes.bool,
  /** Bypasses the request that retrieves the app's settings in order to define the theme type */
  ignoreCozySettings: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
}

CozyTheme.defaultProps = {
  variant: 'normal',
  ignoreCozySettings: false,
  ignoreItself: true
}

export default CozyTheme
