import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import FilterButton from './FilterButton'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import ThemesFilter from '../ThemesFilter'

const SearchHeader = ({
  searchValue,
  setSearchValue,
  selectedThemes,
  setSelectedThemes
}) => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const { isMultiSelectionActive } = useMultiSelection()
  const [isThemesFilterDisplayed, setIsThemesFilterDisplayed] = useState(true)

  const handleFocus = () => {
    if (!isDesktop || isMultiSelectionActive) setIsThemesFilterDisplayed(false)
  }

  const handleThemeSelection = theme => {
    setSelectedThemes(selectedThemes => {
      const selectedThemeExists = selectedThemes.some(
        selectedTheme => selectedTheme.label === theme.label
      )
      if (selectedThemeExists) {
        return selectedThemes.filter(
          selectedTheme => selectedTheme.label !== theme.label
        )
      }
      return [...selectedThemes, theme]
    })
  }

  const hasFilterButton = !isDesktop || (isDesktop && isMultiSelectionActive)

  const hasThemeFilter =
    isThemesFilterDisplayed ||
    (isDesktop && !isMultiSelectionActive) ||
    (!isDesktop && !isMultiSelectionActive && isThemesFilterDisplayed)

  return (
    <div
      className={cx('u-flex u-flex-column-m u-m-1', {
        'u-flex-column': isMultiSelectionActive
      })}
    >
      <div className="u-flex u-w-100 u-flex-items-center">
        <SearchBar
          placeholder={t('common.search')}
          defaultValue={searchValue}
          onChange={ev => setSearchValue(ev.target.value)}
          onFocus={handleFocus}
        />
        {hasFilterButton && (
          <div>
            <FilterButton
              badge={{
                active: Boolean(selectedThemes.length),
                content: selectedThemes.length
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
            selectedThemes={selectedThemes}
            handleThemeSelection={handleThemeSelection}
          />
        </div>
      )}
    </div>
  )
}

SearchHeader.propTypes = {
  selectedThemes: PropTypes.arrayOf(PropTypes.object),
  setSelectedThemes: PropTypes.func,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func
}

export default SearchHeader
