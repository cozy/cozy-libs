import React from 'react'

import { useClient } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/I18n'

const withI18n = Component => {
  const WrappedComponent = props => {
    const client = useClient()
    const lang = client.instanceOptions.cozyLocale

    return (
      <I18n lang={lang} dictRequire={lang => require(`../../locales/${lang}`)}>
        <Component {...props} />
      </I18n>
    )
  }

  return WrappedComponent
}

export default withI18n
