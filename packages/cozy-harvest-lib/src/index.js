import React from 'react'
import I18n from 'cozy-ui/react/I18n'
import Harvest from './Harvest'
import TranslatedAccountForm from './components/AccountForm'

const dictRequire = lang => require(`./locales/${lang}.json`)

export default Harvest

export const AccountForm = (props, context) => (
  <I18n dictRequire={dictRequire} lang={context.lang}>
    <TranslatedAccountForm {...props} />
  </I18n>
)
