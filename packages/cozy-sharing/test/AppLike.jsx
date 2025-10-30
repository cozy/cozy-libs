import React from 'react'

import { CozyProvider, createMockClient } from 'cozy-client'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import CozyTheme from 'cozy-ui-plus/dist/providers/CozyTheme'

import langEn from '../locales/en.json'

const AppLike = ({ children, client }) => (
  <CozyProvider client={client || createMockClient({})}>
    <BreakpointsProvider>
      <CozyTheme>
        <I18n lang="en" dictRequire={() => langEn}>
          <AlertProvider>{children}</AlertProvider>
        </I18n>
      </CozyTheme>
    </BreakpointsProvider>
  </CozyProvider>
)

export default AppLike
