import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'cozy-ui/react/I18n'

import TranslatedDeleteAccountButton from './components/DeleteAccountButton'
import TranslatedTriggerManager from './components/TriggerManager'
import TranslatedTriggerLauncher from './components/TriggerLauncher'

export { KonnectorJobError } from './helpers/konnectors'
import withKonnectorJob from './HOCs/withKonnectorJob'

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

const augment = component => withLocales(withKonnectorJob(component))

export const DeleteAccountButton = withLocales(TranslatedDeleteAccountButton)

export const TriggerManager = augment(TranslatedTriggerManager)

export const TriggerLauncher = augment(TranslatedTriggerLauncher)

export default {
  DeleteAccountButton,
  TriggerLauncher,
  TriggerManager
}
