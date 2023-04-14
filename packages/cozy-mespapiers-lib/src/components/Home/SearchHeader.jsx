import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { models } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import FilterButton from './FilterButton'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import SearchInput from '../SearchInput'
import ThemesFilter from '../ThemesFilter'

const {
  themes: { themesList }
} = models.document

const SearchHeader = ({
  searchValue,
  setSearchValue,
  selectedTheme,
  setSelectedTheme
}) => {
  const { isMobile } = useBreakpoints()
  const { isMultiSelectionActive } = useMultiSelection()
  const [isThemesFilterDisplayed, setIsThemesFilterDisplayed] = useState(
    !isMultiSelectionActive
  )

  const handleThemesFilterDisplayed = isDisplayed => {
    setIsThemesFilterDisplayed(isDisplayed)
  }

  const handleThemeSelection = nextValue => {
    setSelectedTheme(oldValue => (nextValue === oldValue ? '' : nextValue))
  }

  return (
    <div className="u-flex u-flex-column-s u-mv-1 u-ph-half">
      <Box className="u-flex u-flex-items-center u-mb-half-s" flex="1 1 auto">
        <SearchInput
          value={searchValue}
          onChange={ev => setSearchValue(ev.target.value)}
          onFocus={() => handleThemesFilterDisplayed(false)}
        />
        {(!isThemesFilterDisplayed || isMobile) && (
          <FilterButton
            badge={{
              active: !isThemesFilterDisplayed,
              content: selectedTheme ? 1 : 0
            }}
            onClick={() => handleThemesFilterDisplayed(prev => !prev)}
          />
        )}
      </Box>
      <Box className="u-flex u-flex-justify-center" flexWrap="wrap">
        {isThemesFilterDisplayed && (
          <ThemesFilter
            items={themesList}
            selectedTheme={selectedTheme}
            handleThemeSelection={handleThemeSelection}
          />
        )}
      </Box>
    </div>
  )
}

SearchHeader.propTypes = {
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setSelectedTheme: PropTypes.func,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func
}

export default SearchHeader
