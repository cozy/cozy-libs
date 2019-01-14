import React from 'react'
import { I18n } from 'cozy-ui/react'
import Authentication from './Authentication'
import Revoked from './Revoked'
import PropTypes from 'prop-types'

const withLocales = Wrapped => {
  const Wrapper = (props, context) => {
    const { lang } = context
    return (
      <I18n dictRequire={lang => require(`./locales/${lang}.json`)} lang={lang}>
        <Wrapped {...props} />
      </I18n>
    )
  }

  Wrapper.contextTypes = {
    lang: PropTypes.string.isRequired
  }

  return Wrapper
}

const StandaloneAuthentication = withLocales(Authentication)
const StandaloneRevoked = withLocales(Revoked)

export { StandaloneAuthentication as Authentication }
export { StandaloneRevoked as Revoked }
