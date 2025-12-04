import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { extend } from 'twake-i18n'

import { getDisplayName } from './utils'

/**
 * HOC which ensures that a component get extended I18n with locales data from
 * konnector manifest.
 */
export const withKonnectorLocales = WrappedComponent => {
  class WrapperComponent extends Component {
    constructor(props, context) {
      super(props, context)
      const { konnector, lang } = this.props
      const { locales } = konnector
      if (locales && lang) {
        extend(locales[lang])
      }
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  WrapperComponent.displayName = `withKonnectorLocales(${getDisplayName(
    WrappedComponent
  )}`

  WrapperComponent.propTypes = {
    ...WrappedComponent.propTypes,
    konnector: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired
  }

  return WrapperComponent
}

export default withKonnectorLocales
