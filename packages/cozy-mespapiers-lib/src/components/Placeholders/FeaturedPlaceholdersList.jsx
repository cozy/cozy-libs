import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Placeholder from './Placeholder'
import ActionMenuImportDropdown from './ActionMenuImportDropdown'

const FeaturedPlaceholdersList = ({ featuredPlaceholders }) => {
  const [placeholder, setPlaceholder] = useState(null)
  const actionBtnRefs = useRef([])
  const actionBtnRef = useRef()
  const { t } = useI18n()
  const [isImportDropdownDisplayed, setIsImportDropdownDisplayed] =
    useState(false)
  const navigate = useNavigate()

  const hideImportDropdown = () => {
    setIsImportDropdownDisplayed(false)
    setPlaceholder(null)
  }

  const redirectPaperCreation = placeholder => {
    hideImportDropdown()
    const countrySearchParam = `${
      placeholder.country ? `country=${placeholder.country}` : ''
    }`
    return navigate({
      pathname: `create/${placeholder.label}`,
      search: `${countrySearchParam}`
    })
  }

  const showImportDropdown = idx => placeholder => {
    if (placeholder.connectorCriteria) {
      actionBtnRef.current = actionBtnRefs.current[idx]
      setIsImportDropdownDisplayed(true)
      setPlaceholder(placeholder)
    } else {
      redirectPaperCreation(placeholder)
    }
  }

  return (
    <List className="u-pv-0">
      {featuredPlaceholders.length > 0 && (
        <ListSubheader>{t('FeaturedPlaceholdersList.subheader')}</ListSubheader>
      )}
      <div className="u-pv-half">
        {featuredPlaceholders.map((placeholder, idx) => (
          <Placeholder
            key={idx}
            ref={el => (actionBtnRefs.current[idx] = el)}
            placeholder={placeholder}
            divider={idx !== featuredPlaceholders.length - 1}
            onClick={showImportDropdown(idx)}
          />
        ))}
        <ActionMenuImportDropdown
          isOpened={isImportDropdownDisplayed}
          placeholder={placeholder}
          onClose={hideImportDropdown}
          anchorElRef={actionBtnRef}
          onClick={() => redirectPaperCreation(placeholder)}
        />
      </div>
    </List>
  )
}

FeaturedPlaceholdersList.propTypes = {
  featuredPlaceholders: PropTypes.arrayOf(PropTypes.object)
}

export default FeaturedPlaceholdersList
