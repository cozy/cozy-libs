import React from 'react'
import PropTypes from 'prop-types'

import { extend } from 'cozy-ui/transpiled/react/I18n'

import { getDisplayName } from './utils'

/**
 * HOC which ensures that a component get extended I18n with locales data from
 * konnector manifest.
 */
export const withKonnectorLocales = Component => {
  class WrappedComponent extends Component {
    constructor(props, context) {
      super(props, context)
      const { konnector, lang } = this.props
      const { locales } = konnector
      if (locales && lang) {
        extend(locales[lang])
      }
    }

    render() {
      return <Component {...this.props} />
    }
  }

  WrappedComponent.displayName = `withKonnectorLocales(${getDisplayName(
    Component
  )}`

  WrappedComponent.propTypes = {
    ...Component.propTypes,
    konnector: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired
  }

  return WrappedComponent
}

export default withKonnectorLocales
