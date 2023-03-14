import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import CozyClient, { CozyProvider as CozyClientProvider } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import enLocale from '../src/locales/en.json'

const defaultClient = new CozyClient()
defaultClient.ensureStore()

const AppLike = ({
  client: clientOption,
  store: storeOption,
  locale,
  children
}) => {
  const client = clientOption || defaultClient
  const store = storeOption || defaultClient.store
  return (
    <CozyClientProvider client={client}>
      <BreakpointsProvider>
        <I18n lang="en" dictRequire={() => locale || enLocale}>
          <ReduxProvider store={store}>{children}</ReduxProvider>
        </I18n>
      </BreakpointsProvider>
    </CozyClientProvider>
  )
}

export default AppLike
