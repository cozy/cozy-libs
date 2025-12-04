import PropTypes from 'prop-types'
import React from 'react'
import useExtendI18n from 'twake-i18n'

import AssistantProvider from './AssistantProvider'
import { locales } from '../locales'
import SearchBar from './Search/SearchBar'
import SearchProvider from './Search/SearchProvider'

const AssistantDesktop = ({ componentsProps, searchOptions = {} }) => {
  useExtendI18n(locales)

  return (
    <div className="u-mh-auto u-w-100 u-maw-100">
      <AssistantProvider>
        <SearchProvider searchOptions={searchOptions}>
          <SearchBar componentsProps={componentsProps} />
        </SearchProvider>
      </AssistantProvider>
    </div>
  )
}
AssistantDesktop.propTypes = {
  componentsProps: PropTypes.shape({
    SearchBarDesktop: PropTypes.shape({
      elevation: PropTypes.number,
      size: PropTypes.string,
      hasHalfBorderRadius: PropTypes.bool,
      className: PropTypes.string,
      disabledHover: PropTypes.bool
    })
  })
}

export default AssistantDesktop
