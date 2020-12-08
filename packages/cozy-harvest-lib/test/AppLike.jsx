import React from 'react'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { CozyProvider as CozyClientProvider } from 'cozy-client'
import enLocale from '../src/locales/en.json'

const AppLike = ({ client, locale, children }) => {
  return (
    <CozyClientProvider client={client}>
      <BreakpointsProvider>
        <I18n lang="en" dictRequire={() => locale || enLocale}>
          {children}
        </I18n>
      </BreakpointsProvider>
    </CozyClientProvider>
  )
}

export default AppLike
