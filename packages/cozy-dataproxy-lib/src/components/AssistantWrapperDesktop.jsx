import PropTypes from 'prop-types'
import React from 'react'

import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import useExtendI18n from 'cozy-ui/transpiled/react/providers/I18n/useExtendI18n'

import AssistantProvider from './AssistantProvider'
import SearchBar from './Search/SearchBar'
import SearchProvider from './Search/SearchProvider'
import localesEn from '../locales/en.json'
import localesFr from '../locales/fr.json'

const locales = { fr: localesFr, en: localesEn }

const AssistantWrapperDesktop = ({ componentsProps }) => {
  useExtendI18n(locales)

  return (
    <div className="u-mh-auto u-w-100" style={{ maxWidth: '100%' }}>
      <AssistantProvider>
        <SearchProvider>
          <SearchBar componentsProps={componentsProps} />
        </SearchProvider>
      </AssistantProvider>
    </div>
  )
}
AssistantWrapperDesktop.propTypes = {
  componentsProps: PropTypes.shape({
    SearchBarDesktop: PropTypes.shape({
      elevation: PropTypes.boolean,
      size: PropTypes.string,
      hasHalfBorderRadius: PropTypes.bool
    })
  })
}

export default AssistantWrapperDesktop
