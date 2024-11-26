import React from 'react'

import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import AssistantProvider from './AssistantProvider'
import SearchBar from './Search/SearchBar'
import SearchProvider from './Search/SearchProvider'
import localesEn from '../locales/en.json'
import localesFr from '../locales/fr.json'

const AssistantWrapperDesktop = () => {
  const locales = { fr: localesFr, en: localesEn }
  useExtendI18n(locales)

  return (
    <CozyTheme variant="normal">
      <div className="app-list-wrapper u-mb-3 u-mh-auto u-w-100">
        <AssistantProvider>
          <SearchProvider>
            <SearchBar />
          </SearchProvider>
        </AssistantProvider>
      </div>
    </CozyTheme>
  )
}

export default AssistantWrapperDesktop
