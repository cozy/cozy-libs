import React from 'react'
import I18n from 'cozy-ui/react/I18n'
import TranslatedAccountForm from './components/AccountForm'
import TranslatedTriggerManager from './components/TriggerManager'

const dictRequire = lang => require(`./locales/${lang}.json`)

export const AccountForm = (props, context) => (
  <I18n dictRequire={dictRequire} lang={context.lang}>
    <TranslatedAccountForm {...props} />
  </I18n>
)

export const TriggerManager = (props, context) => (
  <I18n dictRequire={dictRequire} lang={context.lang}>
    <TranslatedTriggerManager {...props} />
  </I18n>
)

export default {
  AccountForm,
  TriggerManager
}
