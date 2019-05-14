import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'cozy-ui/react/I18n'

import TranslatedTriggerManager from './components/TriggerManager'
import TranslatedTriggerLauncher from './components/TriggerLauncher'

export { KonnectorJobError } from './helpers/konnectors'

const dictRequire = lang => require(`./locales/${lang}.json`)

const withLocales = WrappedComponent =>
  class ComponentWithLocales extends Component {
    static contextTypes = {
      lang: PropTypes.string.isRequired
    }

    render() {
      const { lang } = this.context
      return (
        <I18n dictRequire={dictRequire} lang={lang}>
          <WrappedComponent {...this.props} />
        </I18n>
      )
    }
  }

export const TriggerManager = withLocales(TranslatedTriggerManager)

export const TriggerLauncher = withLocales(TranslatedTriggerLauncher)

export default {
  TriggerLauncher,
  TriggerManager
}
