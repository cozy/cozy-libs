import React from 'react'
import { I18n } from 'cozy-ui/transpiled/react'
import langEn from '../locales/en.json'

export const TestI18n = ({ children }) => {
  return (
    <I18n lang={'en'} dictRequire={() => langEn}>
      {children}
    </I18n>
  )
}

const AppLike = ({ children }) => <TestI18n>{children}</TestI18n>

export default AppLike
