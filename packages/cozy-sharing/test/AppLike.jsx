import React from 'react'
import { I18n } from 'cozy-ui/transpiled/react'
import { CozyProvider, createMockClient } from 'cozy-client'
import langEn from '../locales/en.json'

export const TestI18n = ({ children, client }) => {
  return (
    <I18n lang={'en'} dictRequire={() => langEn}>
      <CozyProvider client={client || createMockClient({})}>
        {children}
      </CozyProvider>
    </I18n>
  )
}

const AppLike = ({ children, client }) => (
  <TestI18n client={client}>{children}</TestI18n>
)

export default AppLike
