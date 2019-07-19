import React from 'react'
import PropTypes from 'prop-types'

import { extend } from 'cozy-ui/transpiled/react/I18n'

import { getDisplayName } from './utils'

/**
 * Index of konnectors which locales have already extended the I18n.
 * For now we are not supposed to update konnector locales at runtime and we
 * should just load them once for all.
 */
const loadedKonnectors = []

/**
 * HOC which ensures that a component get extended I18n with locales data from
 * konnector manifest.
 */
export const withKonnectorLocales = Component => {
  class WrappedComponent extends Component {
    constructor(props, context) {
      super(props, context)
      const { konnector, lang } = this.props
      if (loadedKonnectors.includes(konnector.slug)) return

      const { locales } = konnector
      if (locales && lang) {
        extend(locales[lang])
        loadedKonnectors.push(konnector.slug)
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
