import React from 'react'

import { CozyProvider, createMockClient } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'

import langEn from '../locales/en.json'

const AppLike = ({ children, client }) => (
  <BreakpointsProvider>
    <CozyTheme>
      <I18n lang="en" dictRequire={() => langEn}>
        <CozyProvider client={client || createMockClient({})}>
          {children}
        </CozyProvider>
      </I18n>
    </CozyTheme>
  </BreakpointsProvider>
)

export default AppLike
