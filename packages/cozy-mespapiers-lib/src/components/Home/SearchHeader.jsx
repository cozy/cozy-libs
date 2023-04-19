import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { models } from 'cozy-client'
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
  const { isDesktop } = useBreakpoints()
  const { isMultiSelectionActive } = useMultiSelection()
  const [isThemesFilterDisplayed, setIsThemesFilterDisplayed] = useState(true)

  const handleFocus = () => {
    if (!isDesktop || isMultiSelectionActive) setIsThemesFilterDisplayed(false)
  }

  const handleThemeSelection = nextValue => {
    setSelectedTheme(oldValue => (nextValue === oldValue ? '' : nextValue))
  }

  const hasFilterButton =
    !isThemesFilterDisplayed &&
    (!isDesktop || (isDesktop && isMultiSelectionActive))

  const hasThemeFilter =
    isThemesFilterDisplayed ||
    (!isDesktop && !isMultiSelectionActive && isThemesFilterDisplayed)

  return (
    <div
      className={cx('u-flex u-flex-column-m u-m-1', {
        'u-flex-column': isMultiSelectionActive
      })}
    >
      <div className="u-flex u-w-100 u-mt-half">
        <SearchInput
          value={searchValue}
          onChange={ev => setSearchValue(ev.target.value)}
          onFocus={handleFocus}
        />
        {hasFilterButton && (
          <div>
            <FilterButton
              badge={{
                active: Boolean(selectedTheme),
                content: 1
              }}
              onClick={() => setIsThemesFilterDisplayed(prev => !prev)}
            />
          </div>
        )}
      </div>
      {hasThemeFilter && (
        <div
          className={cx(
            'u-flex u-flex-justify-center-m u-mt-half-m u-flex-wrap-m u-ml-0-m',
            {
              ['u-flex-justify-center u-mt-half u-flex-wrap u-ml-0']:
                isMultiSelectionActive,
              'u-ml-1-half': !isMultiSelectionActive
            }
          )}
          id="theme-filters"
        >
          <ThemesFilter
            items={themesList}
            selectedTheme={selectedTheme}
            handleThemeSelection={handleThemeSelection}
          />
        </div>
      )}
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
