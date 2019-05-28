import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'cozy-ui/react/I18n'

import TranslatedDeleteAccountButton from './components/DeleteAccountButton'
import TranslatedTriggerManager from './components/TriggerManager'
import TranslatedTriggerLauncher from './components/TriggerLauncher'
import TranslatedHarvestModal from './components/HarvestModal'
import withKonnectorJob from './components/HOCs/withKonnectorJob'

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

export const DeleteAccountButton = withLocales(TranslatedDeleteAccountButton)

export const TriggerManager = withLocales(
  withKonnectorJob(TranslatedTriggerManager)
)

export const TriggerLauncher = withLocales(
  withKonnectorJob(TranslatedTriggerLauncher)
)

// more complicated component using other Harvest components
export const HarvestModal = withLocales(TranslatedHarvestModal)

export default {
  DeleteAccountButton,
  HarvestModal,
  TriggerLauncher,
  TriggerManager
}
